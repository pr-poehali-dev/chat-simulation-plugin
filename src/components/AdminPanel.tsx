import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import WordPressExporter from '@/components/WordPressExporter';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import ConversationEditor from '@/components/ConversationEditor';
import PrivacySystem from '@/components/PrivacySystem';

interface Bot {
  id: string;
  name: string;
  displayName: string;
  avatar_color: string;
  personality: string;
  isActive: boolean;
  messageCount: number;
  lastActive: string;
}

interface TelegramSettings {
  botToken: string;
  chatId: string;
  isConnected: boolean;
  webhookUrl: string;
}

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
  animationSpeed: string;
  gradientType: string;
}

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  time: string;
  replied: boolean;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bots, setBots] = useState<Bot[]>([
    {
      id: 'bot_1',
      name: 'ai_assistant',
      displayName: 'AI Assistant',
      avatar_color: '#6C5CE7',
      personality: 'Дружелюбный и знающий ассистент по технологиям',
      isActive: true,
      messageCount: 15,
      lastActive: '2 минуты назад'
    },
    {
      id: 'bot_2',
      name: 'tech_bot',
      displayName: 'Tech Bot',
      avatar_color: '#74B9FF',
      personality: 'Эксперт по техническим вопросам и новинкам',
      isActive: true,
      messageCount: 8,
      lastActive: '5 минут назад'
    }
  ]);

  const [userMessages, setUserMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      user_name: 'Алексей',
      message: 'Привет! Расскажите про новые возможности ИИ в веб-разработке',
      time: '14:30',
      replied: false
    },
    {
      id: 'msg_2',
      user_name: 'Мария',
      message: 'Какие инструменты лучше использовать для создания чат-ботов?',
      time: '14:25',
      replied: true
    }
  ]);

  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    botToken: '',
    chatId: '',
    isConnected: false,
    webhookUrl: ''
  });

  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    primaryColor: '#6C5CE7',
    secondaryColor: '#74B9FF',
    accentColor: '#00B894',
    backgroundColor: '#F8F9FA',
    fontFamily: 'Inter',
    borderRadius: '8px',
    animationSpeed: '300ms',
    gradientType: 'linear'
  });

  const [newBot, setNewBot] = useState({
    displayName: '',
    avatar_color: '#6C5CE7',
    personality: ''
  });

  const [showAddBot, setShowAddBot] = useState(false);
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedBots = localStorage.getItem('adminBots');
    const savedTelegram = localStorage.getItem('telegramSettings');
    const savedDesign = localStorage.getItem('designSettings');

    if (savedBots) setBots(JSON.parse(savedBots));
    if (savedTelegram) setTelegramSettings(JSON.parse(savedTelegram));
    if (savedDesign) setDesignSettings(JSON.parse(savedDesign));
  }, []);

  // Сохранение настроек
  const saveSettings = () => {
    localStorage.setItem('adminBots', JSON.stringify(bots));
    localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings));
    localStorage.setItem('designSettings', JSON.stringify(designSettings));
  };

  // Добавление нового бота
  const handleAddBot = () => {
    if (!newBot.displayName.trim()) return;

    const bot: Bot = {
      id: `bot_${Date.now()}`,
      name: newBot.displayName.toLowerCase().replace(/\s+/g, '_'),
      displayName: newBot.displayName,
      avatar_color: newBot.avatar_color,
      personality: newBot.personality,
      isActive: true,
      messageCount: 0,
      lastActive: 'Только что создан'
    };

    setBots(prev => [...prev, bot]);
    setNewBot({ displayName: '', avatar_color: '#6C5CE7', personality: '' });
    setShowAddBot(false);
    saveSettings();
  };

  // Удаление бота
  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
    saveSettings();
  };

  // Переключение активности бота
  const toggleBotActive = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
    saveSettings();
  };

  // Тестирование Telegram подключения
  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken) return;

    try {
      // Здесь будет реальная проверка API
      console.log('Testing Telegram connection...');
      setTelegramSettings(prev => ({ ...prev, isConnected: true }));
      saveSettings();
    } catch (error) {
      console.error('Telegram connection failed:', error);
      setTelegramSettings(prev => ({ ...prev, isConnected: false }));
    }
  };

  // Отправка ответа пользователю
  const sendReply = () => {
    if (!currentMessage || !selectedBot || !replyMessage.trim()) return;

    // Здесь будет логика отправки ответа от выбранного бота
    console.log(`Reply from ${selectedBot}: ${replyMessage}`);
    
    // Обновляем статус сообщения
    setUserMessages(prev => prev.map(msg => 
      msg.id === currentMessage.id ? { ...msg, replied: true } : msg
    ));

    setShowReplyDialog(false);
    setReplyMessage('');
    setSelectedBot('');
    setCurrentMessage(null);
  };

  const openReplyDialog = (message: ChatMessage) => {
    setCurrentMessage(message);
    setShowReplyDialog(true);
  };

  // Применение дизайна
  const applyDesign = () => {
    // Здесь будет логика применения настроек дизайна к основному чату
    document.documentElement.style.setProperty('--primary-color', designSettings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', designSettings.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', designSettings.accentColor);
    saveSettings();
  };

  const presetColors = [
    { name: 'Purple Dream', primary: '#6C5CE7', secondary: '#74B9FF', accent: '#00B894' },
    { name: 'Ocean Breeze', primary: '#0984e3', secondary: '#74b9ff', accent: '#00cec9' },
    { name: 'Sunset Glow', primary: '#e17055', secondary: '#fdcb6e', accent: '#e84393' },
    { name: 'Forest Fresh', primary: '#00b894', secondary: '#55a3ff', accent: '#fd79a8' },
    { name: 'Dark Mode', primary: '#2d3436', secondary: '#636e72', accent: '#6c5ce7' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Заголовок админ-панели */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <Icon name="Settings" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Chat Bot Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Управление ботами и настройки чата
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={telegramSettings.isConnected ? "default" : "secondary"} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${telegramSettings.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{telegramSettings.isConnected ? 'Telegram подключен' : 'Telegram отключен'}</span>
              </Badge>
              <Button onClick={saveSettings} className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Icon name="BarChart3" size={16} />
              <span>Панель управления</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} />
              <span>Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center space-x-2">
              <Icon name="MessageCircleMore" size={16} />
              <span>Переписка</span>
            </TabsTrigger>
            <TabsTrigger value="bots" className="flex items-center space-x-2">
              <Icon name="Bot" size={16} />
              <span>Боты</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} />
              <span>Сообщения</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Приватность</span>
            </TabsTrigger>
            <TabsTrigger value="telegram" className="flex items-center space-x-2">
              <Icon name="Send" size={16} />
              <span>Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center space-x-2">
              <Icon name="Palette" size={16} />
              <span>Дизайн</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Icon name="Download" size={16} />
              <span>Экспорт</span>
            </TabsTrigger>
          </TabsList>

          {/* Панель управления */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные боты</CardTitle>
                  <Icon name="Bot" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bots.filter(bot => bot.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">из {bots.length} всего</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сообщения сегодня</CardTitle>
                  <Icon name="MessageCircle" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bots.reduce((sum, bot) => sum + bot.messageCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+12% от вчера</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                  <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userMessages.length}</div>
                  <p className="text-xs text-muted-foreground">новых сообщений</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Telegram статус</CardTitle>
                  <Icon name="Send" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {telegramSettings.isConnected ? '✅' : '❌'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {telegramSettings.isConnected ? 'Подключен' : 'Отключен'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Активность ботов */}
            <Card>
              <CardHeader>
                <CardTitle>Активность ботов</CardTitle>
                <CardDescription>Статистика сообщений и активности ботов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bots.map(bot => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: bot.avatar_color }}
                        >
                          {bot.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{bot.displayName}</p>
                          <p className="text-sm text-muted-foreground">{bot.personality}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{bot.messageCount} сообщений</p>
                          <p className="text-xs text-muted-foreground">{bot.lastActive}</p>
                        </div>
                        <Badge variant={bot.isActive ? "default" : "secondary"}>
                          {bot.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Расширенная аналитика */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Редактор переписки ботов */}
          <TabsContent value="conversation" className="space-y-6">
            <ConversationEditor />
          </TabsContent>

          {/* Управление ботами */}
          <TabsContent value="bots" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Управление ботами</h2>
                <p className="text-muted-foreground">Создавайте и настраивайте ботов для чата</p>
              </div>
              <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить бота
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать нового бота</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="botName">Имя бота</Label>
                      <Input
                        id="botName"
                        placeholder="Например: Консультант Анна"
                        value={newBot.displayName}
                        onChange={(e) => setNewBot(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="botColor">Цвет аватара</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="botColor"
                          type="color"
                          value={newBot.avatar_color}
                          onChange={(e) => setNewBot(prev => ({ ...prev, avatar_color: e.target.value }))}
                          className="w-20"
                        />
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: newBot.avatar_color }}
                        >
                          {newBot.displayName.charAt(0) || '?'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="botPersonality">Описание личности</Label>
                      <Textarea
                        id="botPersonality"
                        placeholder="Дружелюбный консультант по продуктам компании..."
                        value={newBot.personality}
                        onChange={(e) => setNewBot(prev => ({ ...prev, personality: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddBot(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleAddBot}>Создать бота</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bots.map(bot => (
                <Card key={bot.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: bot.avatar_color }}
                        >
                          {bot.displayName.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bot.displayName}</CardTitle>
                          <p className="text-sm text-muted-foreground">@{bot.name}</p>
                        </div>
                      </div>
                      <Switch
                        checked={bot.isActive}
                        onCheckedChange={() => toggleBotActive(bot.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{bot.personality}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{bot.messageCount} сообщений</span>
                      <span>{bot.lastActive}</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteBot(bot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Сообщения пользователей */}
          <TabsContent value="messages" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Входящие сообщения</h2>
              <p className="text-muted-foreground">Сообщения от пользователей, требующие ответа</p>
            </div>

            <div className="space-y-4">
              {userMessages.map(message => (
                <Card key={message.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                            {message.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{message.user_name}</p>
                            <p className="text-sm text-muted-foreground">{message.time}</p>
                          </div>
                          {message.replied && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Отвечено
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{message.message}</p>
                      </div>
                      <div className="ml-4">
                        {!message.replied && (
                          <Button 
                            size="sm"
                            onClick={() => openReplyDialog(message)}
                            className="bg-gradient-to-r from-primary to-secondary"
                          >
                            <Icon name="Reply" size={14} className="mr-1" />
                            Ответить
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Система приватности */}
          <TabsContent value="privacy" className="space-y-6">
            <PrivacySystem />
          </TabsContent>

          {/* Настройки Telegram */}
          <TabsContent value="telegram" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Настройки Telegram</h2>
              <p className="text-muted-foreground">Подключение бота Telegram для уведомлений</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Подключение к Telegram</CardTitle>
                <CardDescription>
                  Настройте бота Telegram для получения уведомлений о новых сообщениях
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="botToken">Bot Token</Label>
                  <Input
                    id="botToken"
                    type="password"
                    placeholder="1234567890:ABCdefGHijklmNOPqrsTUVwxy"
                    value={telegramSettings.botToken}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, botToken: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Получите токен от @BotFather в Telegram
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="chatId">Chat ID администратора</Label>
                  <Input
                    id="chatId"
                    placeholder="-1001234567890"
                    value={telegramSettings.chatId}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, chatId: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    ID чата или пользователя для получения уведомлений
                  </p>
                </div>

                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://yourdomain.com/wp-json/chatbot/v1/telegram"
                    value={telegramSettings.webhookUrl}
                    onChange={(e) => setTelegramSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    URL для получения ответов от администратора
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={testTelegramConnection}>
                    <Icon name="TestTube" size={16} className="mr-2" />
                    Тестировать подключение
                  </Button>
                  <Button variant="outline">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настроить webhook
                  </Button>
                </div>

                {telegramSettings.isConnected && (
                  <Alert>
                    <Icon name="CheckCircle" className="h-4 w-4" />
                    <AlertDescription>
                      Telegram успешно подключен! Уведомления будут приходить в указанный чат.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Шаблоны уведомлений</CardTitle>
                <CardDescription>Настройте формат уведомлений в Telegram</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Шаблон нового сообщения</Label>
                  <Textarea
                    placeholder="🔔 Новое сообщение от {user_name}:&#10;&#10;{message}&#10;&#10;Время: {time}"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Кнопки ответа</Label>
                  <div className="space-y-2 mt-1">
                    {bots.filter(bot => bot.isActive).map(bot => (
                      <div key={bot.id} className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <span>{bot.displayName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Настройки дизайна */}
          <TabsContent value="design" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Настройки дизайна</h2>
              <p className="text-muted-foreground">Кастомизируйте внешний вид чата</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Цветовая схема</CardTitle>
                  <CardDescription>Настройте основные цвета интерфейса</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Основной цвет</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={designSettings.primaryColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-16"
                        />
                        <Input
                          value={designSettings.primaryColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Вторичный цвет</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={designSettings.secondaryColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-16"
                        />
                        <Input
                          value={designSettings.secondaryColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Акцентный цвет</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={designSettings.accentColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-16"
                        />
                        <Input
                          value={designSettings.accentColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Цвет фона</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={designSettings.backgroundColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-16"
                        />
                        <Input
                          value={designSettings.backgroundColor}
                          onChange={(e) => setDesignSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Готовые темы</Label>
                    <div className="grid gap-2 mt-2">
                      {presetColors.map(preset => (
                        <div 
                          key={preset.name}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => setDesignSettings(prev => ({
                            ...prev,
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            accentColor: preset.accent
                          }))}
                        >
                          <span className="font-medium">{preset.name}</span>
                          <div className="flex space-x-1">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Типография и анимации</CardTitle>
                  <CardDescription>Настройте шрифты и эффекты</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Семейство шрифтов</Label>
                    <Select 
                      value={designSettings.fontFamily} 
                      onValueChange={(value) => setDesignSettings(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Радиус скругления</Label>
                    <Select 
                      value={designSettings.borderRadius} 
                      onValueChange={(value) => setDesignSettings(prev => ({ ...prev, borderRadius: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4px">Минимальное (4px)</SelectItem>
                        <SelectItem value="8px">Среднее (8px)</SelectItem>
                        <SelectItem value="12px">Большое (12px)</SelectItem>
                        <SelectItem value="16px">Очень большое (16px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Скорость анимации</Label>
                    <Select 
                      value={designSettings.animationSpeed} 
                      onValueChange={(value) => setDesignSettings(prev => ({ ...prev, animationSpeed: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200ms">Быстрая (200ms)</SelectItem>
                        <SelectItem value="300ms">Средняя (300ms)</SelectItem>
                        <SelectItem value="500ms">Медленная (500ms)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Тип градиента</Label>
                    <Select 
                      value={designSettings.gradientType} 
                      onValueChange={(value) => setDesignSettings(prev => ({ ...prev, gradientType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Линейный</SelectItem>
                        <SelectItem value="radial">Радиальный</SelectItem>
                        <SelectItem value="conic">Конический</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={applyDesign} className="w-full">
                    <Icon name="Paintbrush" size={16} className="mr-2" />
                    Применить дизайн
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Превью */}
            <Card>
              <CardHeader>
                <CardTitle>Предварительный просмотр</CardTitle>
                <CardDescription>Как будет выглядеть чат с выбранными настройками</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    background: `linear-gradient(135deg, ${designSettings.primaryColor}20, ${designSettings.secondaryColor}20)`,
                    fontFamily: designSettings.fontFamily 
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: designSettings.primaryColor }}
                      >
                        A
                      </div>
                      <div 
                        className="flex-1 p-3 rounded-lg text-white"
                        style={{ background: `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.secondaryColor})` }}
                      >
                        Пример сообщения бота с новыми настройками дизайна
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 justify-end">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: designSettings.accentColor, color: 'white' }}
                      >
                        Ответ пользователя
                      </div>
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: designSettings.accentColor }}
                      >
                        У
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Экспорт WordPress плагина */}
          <TabsContent value="export" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Экспорт WordPress плагина</h2>
              <p className="text-muted-foreground">Создайте готовый к использованию WordPress плагин</p>
            </div>
            
            <WordPressExporter />
          </TabsContent>
        </Tabs>

        {/* Диалог ответа на сообщение */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
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
                  <Select value={selectedBot} onValueChange={setSelectedBot}>
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
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                    Отмена
                  </Button>
                  <Button 
                    onClick={sendReply}
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
      </div>
    </div>
  );
};

export default AdminPanel;