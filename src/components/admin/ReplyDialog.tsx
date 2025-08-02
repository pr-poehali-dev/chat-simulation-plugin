import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Bot {
  id: string;
  displayName: string;
  avatar_color: string;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  time: string;
  replied: boolean;
}

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMessage: ChatMessage | null;
  bots: Bot[];
  selectedBot: string;
  replyMessage: string;
  onSelectedBotChange: (botId: string) => void;
  onReplyMessageChange: (message: string) => void;
  onSendReply: () => void;
}

const ReplyDialog: React.FC<ReplyDialogProps> = ({
  open,
  onOpenChange,
  currentMessage,
  bots,
  selectedBot,
  replyMessage,
  onSelectedBotChange,
  onReplyMessageChange,
  onSendReply
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ответить пользователю</DialogTitle>
        </DialogHeader>
        {currentMessage && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <strong>{currentMessage.user_name}</strong>
                <span className="text-sm text-muted-foreground">{currentMessage.time}</span>
              </div>
              <p>{currentMessage.message}</p>
            </div>

            <div>
              <Label>Выберите бота для ответа</Label>
              <Select value={selectedBot} onValueChange={onSelectedBotChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите бота" />
                </SelectTrigger>
                <SelectContent>
                  {bots.filter(bot => bot.isActive).map(bot => (
                    <SelectItem key={bot.id} value={bot.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: bot.avatar_color }}
                        >
                          {bot.displayName.charAt(0)}
                        </div>
                        <span>{bot.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ваш ответ</Label>
              <Textarea
                placeholder="Введите ответ от имени выбранного бота..."
                value={replyMessage}
                onChange={(e) => onReplyMessageChange(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button 
                onClick={onSendReply}
                disabled={!selectedBot || !replyMessage.trim()}
              >
                <Icon name="Send" size={16} className="mr-2" />
                Отправить ответ
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;