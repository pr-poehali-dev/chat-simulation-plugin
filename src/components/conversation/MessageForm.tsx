import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { ConversationMessage, Bot } from './types';

interface MessageFormProps {
  showAddMessage: boolean;
  setShowAddMessage: (show: boolean) => void;
  editingMessageId: string | null;
  setEditingMessageId: (id: string | null) => void;
  newMessage: {
    bot_name: string;
    message: string;
    time: string;
    reply_to_id: string;
    delay_seconds: number;
  };
  setNewMessage: (message: any) => void;
  bots: Bot[];
  conversation: ConversationMessage[];
  onAddMessage: () => void;
  onSaveEdit: () => void;
  generateTime: () => string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  showAddMessage,
  setShowAddMessage,
  editingMessageId,
  setEditingMessageId,
  newMessage,
  setNewMessage,
  bots,
  conversation,
  onAddMessage,
  onSaveEdit,
  generateTime
}) => {
  const handleCancel = () => {
    setShowAddMessage(false);
    setEditingMessageId(null);
    setNewMessage({
      bot_name: '',
      message: '',
      time: '',
      reply_to_id: '',
      delay_seconds: 3
    });
  };

  return (
    <Dialog open={showAddMessage} onOpenChange={setShowAddMessage}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить сообщение
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingMessageId ? 'Редактировать сообщение' : 'Добавить новое сообщение'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Бот</Label>
              <Select 
                value={newMessage.bot_name} 
                onValueChange={(value) => setNewMessage((prev: any) => ({ ...prev, bot_name: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите бота" />
                </SelectTrigger>
                <SelectContent>
                  {bots.filter(bot => bot.isActive).map(bot => (
                    <SelectItem key={bot.id} value={bot.displayName}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: bot.avatar_color }}
                        ></div>
                        <span>{bot.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Время</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="10:30"
                  value={newMessage.time}
                  onChange={(e) => setNewMessage((prev: any) => ({ ...prev, time: e.target.value }))}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setNewMessage((prev: any) => ({ ...prev, time: generateTime() }))}
                >
                  Сейчас
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Ответ на сообщение (опционально)</Label>
            <Select 
              value={newMessage.reply_to_id} 
              onValueChange={(value) => setNewMessage((prev: any) => ({ ...prev, reply_to_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сообщение для ответа" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-reply">Без ответа</SelectItem>
                {conversation.map(msg => (
                  <SelectItem key={msg.id} value={msg.id}>
                    {msg.bot_name}: {msg.message.length > 30 ? msg.message.substring(0, 30) + '...' : msg.message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Сообщение</Label>
            <Textarea
              placeholder="Введите текст сообщения..."
              value={newMessage.message}
              onChange={(e) => setNewMessage((prev: any) => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          <div>
            <Label>Задержка появления (секунды)</Label>
            <Input
              type="number"
              min="1"
              max="30"
              value={newMessage.delay_seconds}
              onChange={(e) => setNewMessage((prev: any) => ({ 
                ...prev, 
                delay_seconds: parseInt(e.target.value) || 3 
              }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button 
              onClick={() => {
                console.log('Кнопка нажата, вызываем:', editingMessageId ? 'onSaveEdit' : 'onAddMessage');
                console.log('Текущее сообщение:', newMessage);
                editingMessageId ? onSaveEdit() : onAddMessage();
              }}
              disabled={!newMessage.bot_name || !newMessage.message}
            >
              {editingMessageId ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageForm;