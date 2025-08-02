import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface ConversationMessage {
  id: string;
  bot_name: string;
  message: string;
  time: string;
  reply_to?: {
    bot_name: string;
    message_short: string;
    message_id: string;
  };
  avatar_color: string;
  delay_seconds: number;
}

interface Bot {
  id: string;
  name: string;
  displayName: string;
  avatar_color: string;
  personality: string;
  isActive: boolean;
}

const ConversationEditor = () => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: 'msg_1',
      bot_name: 'AI Assistant',
      message: 'Привет всем! Сегодня отличный день для обсуждения новых технологий. Кто-нибудь слышал о последних обновлениях в области машинного обучения?',
      time: '10:00',
      avatar_color: '#6C5CE7',
      delay_seconds: 2
    },
    {
      id: 'msg_2',
      bot_name: 'Tech Bot',
      message: 'Да, особенно интересны новые архитектуры нейронных сетей! Они показывают невероятные результаты.',
      time: '10:02',
      reply_to: {
        bot_name: 'AI Assistant',
        message_short: 'Привет всем! Сегодня отличный день для обсуждения новых технологий...',
        message_id: 'msg_1'
      },
      avatar_color: '#74B9FF',
      delay_seconds: 3
    },
    {
      id: 'msg_3',
      bot_name: 'Data Guru',
      message: 'Согласен! А что думаете о влиянии ИИ на будущее разработки? Лично я считаю, что мы находимся на пороге революции.',
      time: '10:05',
      avatar_color: '#00B894',
      delay_seconds: 4
    }
  ]);

  const [bots, setBots] = useState<Bot[]>([
    {
      id: 'bot_1',
      name: 'ai_assistant',
      displayName: 'AI Assistant',
      avatar_color: '#6C5CE7',
      personality: 'Дружелюбный и знающий ассистент по технологиям',
      isActive: true
    },
    {
      id: 'bot_2',
      name: 'tech_bot',
      displayName: 'Tech Bot',
      avatar_color: '#74B9FF',
      personality: 'Эксперт по техническим вопросам и новинкам',
      isActive: true
    },
    {
      id: 'bot_3',
      name: 'data_guru',
      displayName: 'Data Guru',
      avatar_color: '#00B894',
      personality: 'Специалист по данным и аналитике',
      isActive: true
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    bot_name: '',
    message: '',
    time: '',
    reply_to_id: '',
    delay_seconds: 3
  });

  const [showAddMessage, setShowAddMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonImport, setShowJsonImport] = useState(false);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedConversation = localStorage.getItem('botConversation');
    const savedBots = localStorage.getItem('adminBots');
    
    if (savedConversation) {
      try {
        setConversation(JSON.parse(savedConversation));
      } catch (e) {
        console.error('Error loading conversation:', e);
      }
    }
    
    if (savedBots) {
      try {
        setBots(JSON.parse(savedBots));
      } catch (e) {
        console.error('Error loading bots:', e);
      }
    }
  }, []);

  // Сохранение переписки
  const saveConversation = () => {
    localStorage.setItem('botConversation', JSON.stringify(conversation));
    // Также сохраняем в формате для основного чата
    localStorage.setItem('chatMessages', JSON.stringify(conversation));
  };

  // Добавление нового сообщения
  const addMessage = () => {
    if (!newMessage.bot_name || !newMessage.message) return;

    const selectedBot = bots.find(bot => bot.displayName === newMessage.bot_name);
    if (!selectedBot) return;

    const replyTo = newMessage.reply_to_id ? 
      conversation.find(msg => msg.id === newMessage.reply_to_id) : null;

    const message: ConversationMessage = {
      id: `msg_${Date.now()}`,
      bot_name: newMessage.bot_name,
      message: newMessage.message,
      time: newMessage.time || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      avatar_color: selectedBot.avatar_color,
      delay_seconds: newMessage.delay_seconds,
      reply_to: replyTo ? {
        bot_name: replyTo.bot_name,
        message_short: replyTo.message.length > 50 ? 
          replyTo.message.substring(0, 50) + '...' : replyTo.message,
        message_id: replyTo.id
      } : undefined
    };

    setConversation(prev => [...prev, message]);
    setNewMessage({
      bot_name: '',
      message: '',
      time: '',
      reply_to_id: '',
      delay_seconds: 3
    });
    setShowAddMessage(false);
    saveConversation();
  };

  // Удаление сообщения
  const deleteMessage = (messageId: string) => {
    setConversation(prev => prev.filter(msg => msg.id !== messageId));
    saveConversation();
  };

  // Редактирование сообщения
  const editMessage = (messageId: string) => {
    const message = conversation.find(msg => msg.id === messageId);
    if (message) {
      setNewMessage({
        bot_name: message.bot_name,
        message: message.message,
        time: message.time,
        reply_to_id: message.reply_to?.message_id || '',
        delay_seconds: message.delay_seconds
      });
      setEditingMessageId(messageId);
      setShowAddMessage(true);
    }
  };

  // Сохранение изменений
  const saveEdit = () => {
    if (!editingMessageId) return;

    const selectedBot = bots.find(bot => bot.displayName === newMessage.bot_name);
    if (!selectedBot) return;

    const replyTo = newMessage.reply_to_id ? 
      conversation.find(msg => msg.id === newMessage.reply_to_id) : null;

    setConversation(prev => prev.map(msg => 
      msg.id === editingMessageId ? {
        ...msg,
        bot_name: newMessage.bot_name,
        message: newMessage.message,
        time: newMessage.time,
        avatar_color: selectedBot.avatar_color,
        delay_seconds: newMessage.delay_seconds,
        reply_to: replyTo ? {
          bot_name: replyTo.bot_name,
          message_short: replyTo.message.length > 50 ? 
            replyTo.message.substring(0, 50) + '...' : replyTo.message,
          message_id: replyTo.id
        } : undefined
      } : msg
    ));

    setEditingMessageId(null);
    setNewMessage({
      bot_name: '',
      message: '',
      time: '',
      reply_to_id: '',
      delay_seconds: 3
    });
    setShowAddMessage(false);
    saveConversation();
  };

  // Перемещение сообщения
  const moveMessage = (messageId: string, direction: 'up' | 'down') => {
    const currentIndex = conversation.findIndex(msg => msg.id === messageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= conversation.length) return;

    const newConversation = [...conversation];
    const [movedMessage] = newConversation.splice(currentIndex, 1);
    newConversation.splice(newIndex, 0, movedMessage);

    setConversation(newConversation);
    saveConversation();
  };

  // Экспорт в JSON
  const exportToJson = () => {
    const exportData = {
      conversation,
      bots: bots.filter(bot => bot.isActive),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bot-conversation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Импорт из JSON
  const importFromJson = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (data.conversation && Array.isArray(data.conversation)) {
        setConversation(data.conversation);
        saveConversation();
        setJsonInput('');
        setShowJsonImport(false);
      } else {
        alert('Неверный формат JSON');
      }
    } catch (e) {
      alert('Ошибка парсинга JSON');
    }
  };

  // Очистка переписки
  const clearConversation = () => {
    if (confirm('Вы уверены, что хотите очистить всю переписку?')) {
      setConversation([]);
      saveConversation();
    }
  };

  // Генерация времени для нового сообщения
  const generateTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Редактор переписки ботов</h2>
          <p className="text-muted-foreground">
            Создайте реалистичную переписку между ботами для отображения в чате
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportToJson} variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт JSON
          </Button>
          <Dialog open={showJsonImport} onOpenChange={setShowJsonImport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Icon name="Upload" size={16} className="mr-2" />
                Импорт JSON
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Импорт переписки из JSON</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Вставьте JSON данные переписки..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={10}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowJsonImport(false)}>
                    Отмена
                  </Button>
                  <Button onClick={importFromJson}>
                    Импортировать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={clearConversation} variant="destructive">
            <Icon name="Trash2" size={16} className="mr-2" />
            Очистить
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Список сообщений */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Переписка ботов</CardTitle>
                  <CardDescription>
                    {conversation.length} сообщений • Общая длительность: {conversation.reduce((sum, msg) => sum + msg.delay_seconds, 0)}с
                  </CardDescription>
                </div>
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
                          <Select value={newMessage.bot_name} onValueChange={(value) => setNewMessage(prev => ({ ...prev, bot_name: value }))}>
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
                              onChange={(e) => setNewMessage(prev => ({ ...prev, time: e.target.value }))}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setNewMessage(prev => ({ ...prev, time: generateTime() }))}
                            >
                              Сейчас
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Ответ на сообщение (опционально)</Label>
                        <Select value={newMessage.reply_to_id} onValueChange={(value) => setNewMessage(prev => ({ ...prev, reply_to_id: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сообщение для ответа" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Без ответа</SelectItem>
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
                          onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
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
                          onChange={(e) => setNewMessage(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) || 3 }))}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddMessage(false);
                            setEditingMessageId(null);
                            setNewMessage({
                              bot_name: '',
                              message: '',
                              time: '',
                              reply_to_id: '',
                              delay_seconds: 3
                            });
                          }}
                        >
                          Отмена
                        </Button>
                        <Button onClick={editingMessageId ? saveEdit : addMessage}>
                          {editingMessageId ? 'Сохранить' : 'Добавить'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Переписка пуста. Добавьте первое сообщение.</p>
                  </div>
                ) : (
                  conversation.map((message, index) => (
                    <div key={message.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: message.avatar_color }}
                          >
                            {message.bot_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{message.bot_name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{message.time}</span>
                              <Badge variant="outline" className="text-xs">
                                +{message.delay_seconds}s
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMessage(message.id, 'up')}
                            disabled={index === 0}
                          >
                            <Icon name="ChevronUp" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMessage(message.id, 'down')}
                            disabled={index === conversation.length - 1}
                          >
                            <Icon name="ChevronDown" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editMessage(message.id)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Цитата если есть */}
                      {message.reply_to && (
                        <div className="bg-gray-50 border-l-4 border-primary p-3 rounded-r-lg">
                          <p className="text-sm font-medium">{message.reply_to.bot_name}</p>
                          <p className="text-sm text-muted-foreground italic">
                            {message.reply_to.message_short}
                          </p>
                        </div>
                      )}

                      <p className="text-gray-800">{message.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Превью и инструкции */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Превью чата</CardTitle>
              <CardDescription>Как переписка будет выглядеть в чате</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {conversation.slice(0, 3).map((message) => (
                    <div key={message.id} className="flex items-start space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: message.avatar_color }}
                      >
                        {message.bot_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs font-semibold">{message.bot_name}</p>
                          <p className="text-xs text-gray-600">
                            {message.message.length > 60 ? 
                              message.message.substring(0, 60) + '...' : 
                              message.message
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {conversation.length > 3 && (
                    <p className="text-center text-xs text-muted-foreground">
                      ... и ещё {conversation.length - 3} сообщений
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Инструкции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Icon name="MessageCircle" size={16} className="mt-0.5 text-primary" />
                <p>Создавайте реалистичную переписку между ботами</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Clock" size={16} className="mt-0.5 text-primary" />
                <p>Настраивайте задержки для естественного темпа</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Reply" size={16} className="mt-0.5 text-primary" />
                <p>Используйте ответы для создания диалогов</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Move" size={16} className="mt-0.5 text-primary" />
                <p>Перемещайте сообщения для правильной последовательности</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Download" size={16} className="mt-0.5 text-primary" />
                <p>Экспортируйте и импортируйте переписки в JSON</p>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Icon name="Info" className="h-4 w-4" />
            <AlertDescription>
              Переписка сохраняется автоматически и будет использована в основном чате. 
              Сообщения появляются с настроенными задержками.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default ConversationEditor;