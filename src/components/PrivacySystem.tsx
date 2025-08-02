import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface UserSession {
  sessionId: string;
  userName: string;
  ip: string;
  firstVisit: string;
  lastActivity: string;
  messageCount: number;
  isActive: boolean;
  userAgent: string;
}

interface PrivateMessage {
  id: string;
  sessionId: string;
  userName: string;
  message: string;
  timestamp: string;
  replied: boolean;
  repliedBy?: string;
  repliedAt?: string;
  isVisible: boolean;
}

interface TelegramMessage {
  id: string;
  messageId: string;
  fromAdmin: boolean;
  botName?: string;
  text: string;
  timestamp: string;
  targetSessionId: string;
}

const PrivacySystem = () => {
  const [userSessions, setUserSessions] = useState<UserSession[]>([
    {
      sessionId: 'sess_001',
      userName: 'Анна',
      ip: '192.168.1.1',
      firstVisit: '2024-01-15 14:30',
      lastActivity: '2024-01-15 14:45',
      messageCount: 3,
      isActive: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      sessionId: 'sess_002',
      userName: 'Михаил',
      ip: '192.168.1.2',
      firstVisit: '2024-01-15 14:20',
      lastActivity: '2024-01-15 14:50',
      messageCount: 5,
      isActive: true,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      sessionId: 'sess_003',
      userName: 'Елена',
      ip: '192.168.1.3',
      firstVisit: '2024-01-15 13:45',
      lastActivity: '2024-01-15 14:30',
      messageCount: 2,
      isActive: false,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    }
  ]);

  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([
    {
      id: 'msg_001',
      sessionId: 'sess_001',
      userName: 'Анна',
      message: 'Привет! У меня вопрос по вашему продукту. Можете помочь?',
      timestamp: '2024-01-15 14:30',
      replied: false,
      isVisible: true
    },
    {
      id: 'msg_002',
      sessionId: 'sess_001',
      userName: 'Анна',
      message: 'Какие у вас условия доставки?',
      timestamp: '2024-01-15 14:32',
      replied: true,
      repliedBy: 'AI Assistant',
      repliedAt: '2024-01-15 14:33',
      isVisible: true
    },
    {
      id: 'msg_003',
      sessionId: 'sess_002',
      userName: 'Михаил',
      message: 'Интересный чат! Как работает ваша система ИИ?',
      timestamp: '2024-01-15 14:25',
      replied: false,
      isVisible: true
    },
    {
      id: 'msg_004',
      sessionId: 'sess_002',
      userName: 'Михаил',
      message: 'Можно ли интегрировать это в мой проект?',
      timestamp: '2024-01-15 14:40',
      replied: true,
      repliedBy: 'Tech Bot',
      repliedAt: '2024-01-15 14:42',
      isVisible: true
    }
  ]);

  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>([
    {
      id: 'tg_001',
      messageId: 'msg_001',
      fromAdmin: false,
      text: '🔔 Новое сообщение от Анна:\n\nПривет! У меня вопрос по вашему продукту. Можете помочь?\n\nВремя: 14:30',
      timestamp: '2024-01-15 14:30',
      targetSessionId: 'sess_001'
    },
    {
      id: 'tg_002',
      messageId: 'msg_002',
      fromAdmin: true,
      botName: 'AI Assistant',
      text: 'Конечно! Мы предлагаем бесплатную доставку по всей России для заказов от 2000 рублей.',
      timestamp: '2024-01-15 14:33',
      targetSessionId: 'sess_001'
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<string>('');
  const [privacyStats, setPrivacyStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    totalMessages: 0,
    privateMessages: 0,
    repliedMessages: 0
  });

  // Обновление статистики
  useEffect(() => {
    setPrivacyStats({
      totalSessions: userSessions.length,
      activeSessions: userSessions.filter(s => s.isActive).length,
      totalMessages: privateMessages.length,
      privateMessages: privateMessages.filter(m => m.isVisible).length,
      repliedMessages: privateMessages.filter(m => m.replied).length
    });
  }, [userSessions, privateMessages]);

  // Симуляция получения нового сообщения
  const simulateNewMessage = () => {
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    const userName = ['Алексей', 'Мария', 'Дмитрий', 'Ольга'][Math.floor(Math.random() * 4)];
    
    // Добавляем новую сессию
    const newSession: UserSession = {
      sessionId,
      userName,
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      firstVisit: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messageCount: 1,
      isActive: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    setUserSessions(prev => [newSession, ...prev]);

    // Добавляем сообщение
    const newMessage: PrivateMessage = {
      id: 'msg_' + Date.now(),
      sessionId,
      userName,
      message: [
        'Здравствуйте! Подскажите пожалуйста по вашим услугам',
        'Интересует ваш продукт, есть ли техподдержка?',
        'Какие у вас цены? Можно скидку?',
        'Хочу заказать, как это сделать?',
        'У меня проблема, помогите разобраться'
      ][Math.floor(Math.random() * 5)],
      timestamp: new Date().toISOString(),
      replied: false,
      isVisible: true
    };

    setPrivateMessages(prev => [newMessage, ...prev]);

    // Симулируем отправку в Telegram
    const telegramNotification: TelegramMessage = {
      id: 'tg_' + Date.now(),
      messageId: newMessage.id,
      fromAdmin: false,
      text: `🔔 Новое сообщение от ${userName}:\n\n${newMessage.message}\n\nВремя: ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      targetSessionId: sessionId
    };

    setTelegramMessages(prev => [telegramNotification, ...prev]);
  };

  // Симуляция ответа администратора
  const simulateAdminReply = (messageId: string) => {
    const message = privateMessages.find(m => m.id === messageId);
    if (!message || message.replied) return;

    const botNames = ['AI Assistant', 'Tech Bot', 'Support Bot'];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    
    const replies = [
      'Спасибо за ваш вопрос! С радостью помогу вам.',
      'Конечно, я могу предоставить подробную информацию.',
      'Отличный вопрос! Позвольте объяснить подробнее.',
      'Понимаю ваш интерес. Вот что я могу предложить.',
      'Благодарю за обращение! Рассмотрим ваш вопрос.'
    ];

    const replyText = replies[Math.floor(Math.random() * replies.length)];

    // Обновляем сообщение как отвеченное
    setPrivateMessages(prev => prev.map(m => 
      m.id === messageId ? {
        ...m,
        replied: true,
        repliedBy: botName,
        repliedAt: new Date().toISOString()
      } : m
    ));

    // Добавляем ответ в Telegram
    const adminReply: TelegramMessage = {
      id: 'tg_' + Date.now(),
      messageId: messageId,
      fromAdmin: true,
      botName,
      text: replyText,
      timestamp: new Date().toISOString(),
      targetSessionId: message.sessionId
    };

    setTelegramMessages(prev => [adminReply, ...prev]);
  };

  // Скрытие сообщения (имитация приватности)
  const toggleMessageVisibility = (messageId: string) => {
    setPrivateMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isVisible: !m.isVisible } : m
    ));
  };

  // Деактивация сессии
  const deactivateSession = (sessionId: string) => {
    setUserSessions(prev => prev.map(s => 
      s.sessionId === sessionId ? { ...s, isActive: false } : s
    ));
  };

  const getSessionMessages = (sessionId: string) => {
    return privateMessages.filter(m => m.sessionId === sessionId);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) return 'mobile';
    if (userAgent.includes('iPad') || userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Система приватности</h2>
          <p className="text-muted-foreground">
            Управление приватными сообщениями пользователей и Telegram интеграцией
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={simulateNewMessage} className="bg-gradient-to-r from-primary to-secondary">
            <Icon name="MessageCircle" size={16} className="mr-2" />
            Симулировать сообщение
          </Button>
        </div>
      </div>

      {/* Статистика приватности */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего сессий</CardTitle>
            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privacyStats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">уникальных пользователей</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные сессии</CardTitle>
            <Icon name="Activity" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privacyStats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">сейчас онлайн</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Приватные сообщения</CardTitle>
            <Icon name="Lock" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privacyStats.privateMessages}</div>
            <p className="text-xs text-muted-foreground">видны только автору</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отвечено</CardTitle>
            <Icon name="MessageSquare" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privacyStats.repliedMessages}</div>
            <p className="text-xs text-muted-foreground">
              {((privacyStats.repliedMessages / privacyStats.totalMessages) * 100).toFixed(1)}% от всех
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telegram статус</CardTitle>
            <Icon name="Send" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✅</div>
            <p className="text-xs text-muted-foreground">интеграция активна</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Активные пользователи */}
        <Card>
          <CardHeader>
            <CardTitle>Активные сессии</CardTitle>
            <CardDescription>Пользователи онлайн прямо сейчас</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSessions.filter(s => s.isActive).map(session => (
                <div 
                  key={session.sessionId}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedSession === session.sessionId ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => setSelectedSession(session.sessionId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                        {session.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{session.userName}</p>
                        <p className="text-xs text-muted-foreground">{session.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        <Icon name={getDeviceType(session.userAgent) === 'mobile' ? 'Smartphone' : 'Monitor'} size={10} className="mr-1" />
                        {getDeviceType(session.userAgent)}
                      </Badge>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.messageCount} сообщений • последняя активность: {formatTimestamp(session.lastActivity)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Приватные сообщения */}
        <Card>
          <CardHeader>
            <CardTitle>Приватные сообщения</CardTitle>
            <CardDescription>
              {selectedSession 
                ? `Сообщения пользователя ${userSessions.find(s => s.sessionId === selectedSession)?.userName || ''}`
                : 'Все приватные сообщения пользователей'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(selectedSession 
                ? getSessionMessages(selectedSession) 
                : privateMessages
              ).map(message => (
                <div key={message.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{message.userName}</span>
                      {message.replied && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Отвечено
                        </Badge>
                      )}
                      {!message.isVisible && (
                        <Badge variant="destructive" className="text-xs">
                          Скрыто
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMessageVisibility(message.id)}
                        className="text-xs"
                      >
                        <Icon name={message.isVisible ? 'Eye' : 'EyeOff'} size={14} />
                      </Button>
                      {!message.replied && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => simulateAdminReply(message.id)}
                          className="text-xs"
                        >
                          <Icon name="Reply" size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{message.message}</p>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                    {message.replied && (
                      <span className="ml-2">
                        • Ответил {message.repliedBy} в {formatTimestamp(message.repliedAt!)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Telegram интеграция */}
        <Card>
          <CardHeader>
            <CardTitle>Telegram интеграция</CardTitle>
            <CardDescription>Уведомления и ответы через Telegram бота</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {telegramMessages.map(tgMsg => (
                <div 
                  key={tgMsg.id}
                  className={`border rounded-lg p-3 ${
                    tgMsg.fromAdmin ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={tgMsg.fromAdmin ? 'ArrowLeft' : 'ArrowRight'} 
                        size={14}
                        className={tgMsg.fromAdmin ? 'text-blue-600' : 'text-yellow-600'}
                      />
                      <span className="text-sm font-medium">
                        {tgMsg.fromAdmin ? `Ответ (${tgMsg.botName})` : 'Уведомление'}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        tgMsg.fromAdmin ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Telegram
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-800 mb-2 whitespace-pre-line">{tgMsg.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(tgMsg.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Icon name="Shield" className="h-4 w-4" />
        <AlertDescription>
          <strong>Система приватности:</strong> Каждый пользователь видит только свои сообщения и ответы ботов. 
          Сообщения других пользователей полностью скрыты. Все коммуникации проходят через защищенные сессии.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Принципы работы приватности</CardTitle>
          <CardDescription>Как обеспечивается конфиденциальность пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="Lock" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Изоляция сессий</h4>
                  <p className="text-sm text-muted-foreground">
                    Каждый пользователь имеет уникальную сессию, полностью изолированную от других
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="Eye" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Видимость сообщений</h4>
                  <p className="text-sm text-muted-foreground">
                    Пользователь видит только переписку ботов и свои сообщения
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="MessageCircle" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Приватные ответы</h4>
                  <p className="text-sm text-muted-foreground">
                    Ответы от ботов видны только тому пользователю, который задал вопрос
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="Send" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Telegram уведомления</h4>
                  <p className="text-sm text-muted-foreground">
                    Администратор получает все сообщения в Telegram с возможностью ответа
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="Users" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Мониторинг сессий</h4>
                  <p className="text-sm text-muted-foreground">
                    Отслеживание активности без нарушения приватности пользователей
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Защита данных</h4>
                  <p className="text-sm text-muted-foreground">
                    Все данные храются локально с минимальной передачей в сеть
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySystem;