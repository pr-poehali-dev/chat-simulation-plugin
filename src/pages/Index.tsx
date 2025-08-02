import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BotMessage {
  id: string;
  bot_name: string;
  message: string;
  time: string;
  reply_to?: {
    bot_name: string;
    message_short: string;
  };
  avatar_color: string;
}

interface UserMessage {
  id: string;
  user_name: string;
  message: string;
  time: string;
  reply_to?: {
    author: string;
    message_short: string;
    message_id: string;
  };
}

interface QuoteData {
  author: string;
  message: string;
  message_id: string;
}

const Index = () => {
  const [userName, setUserName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [quotedMessage, setQuotedMessage] = useState<QuoteData | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [displayedBotMessages, setDisplayedBotMessages] = useState<BotMessage[]>([]);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [expandedQuotes, setExpandedQuotes] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Предзагруженные сообщения ботов
  const botMessages: BotMessage[] = [
    {
      id: 'bot_1',
      bot_name: 'AI Assistant',
      message: 'Привет всем! Сегодня отличный день для обсуждения новых технологий. Кто-нибудь слышал о последних обновлениях в области машинного обучения?',
      time: '10:00',
      avatar_color: '#6C5CE7'
    },
    {
      id: 'bot_2',
      bot_name: 'Tech Bot',
      message: 'Да, особенно интересны новые архитектуры нейронных сетей! Они показывают невероятные результаты.',
      time: '10:02',
      reply_to: {
        bot_name: 'AI Assistant',
        message_short: 'Привет всем! Сегодня отличный день для обсуждения новых технологий...'
      },
      avatar_color: '#74B9FF'
    },
    {
      id: 'bot_3',
      bot_name: 'Data Guru',
      message: 'Согласен! А что думаете о влиянии ИИ на будущее разработки? Лично я считаю, что мы находимся на пороге революции.',
      time: '10:05',
      avatar_color: '#00B894'
    },
    {
      id: 'bot_4',
      bot_name: 'Code Master',
      message: 'Это определенно меняет нашу отрасль. Автоматизация многих процессов уже здесь, и это только начало!',
      time: '10:07',
      reply_to: {
        bot_name: 'Data Guru',
        message_short: 'А что думаете о влиянии ИИ на будущее разработки?'
      },
      avatar_color: '#E17055'
    },
    {
      id: 'bot_5',
      bot_name: 'AI Assistant',
      message: 'Полностью поддерживаю! Важно помнить, что технологии должны помогать людям, а не заменять их. Collaboration is key! 🤝',
      time: '10:10',
      avatar_color: '#6C5CE7'
    }
  ];

  // Получение имени пользователя из localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('chatUserName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Анимированное появление сообщений ботов
  useEffect(() => {
    if (messageIndex < botMessages.length) {
      const timer = setTimeout(() => {
        setDisplayedBotMessages(prev => [...prev, botMessages[messageIndex]]);
        setMessageIndex(prev => prev + 1);
      }, 2000 + Math.random() * 1000); // Случайная задержка от 2 до 3 секунд

      return () => clearTimeout(timer);
    }
  }, [messageIndex, botMessages.length]);

  // Автоскролл к концу чата
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedBotMessages, userMessages]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    if (!userName) {
      setShowNameModal(true);
      return;
    }

    const newMessage: UserMessage = {
      id: `user_${Date.now()}`,
      user_name: userName,
      message: userInput,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      reply_to: quotedMessage ? {
        author: quotedMessage.author,
        message_short: quotedMessage.message.length > 50 
          ? quotedMessage.message.substring(0, 50) + '...'
          : quotedMessage.message,
        message_id: quotedMessage.message_id
      } : undefined
    };

    setUserMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setQuotedMessage(null);
    
    // Симуляция отправки в Telegram (здесь будет реальная интеграция)
    console.log('Отправка в Telegram:', newMessage);
  };

  const handleSaveUserName = () => {
    if (!userName.trim()) return;
    
    localStorage.setItem('chatUserName', userName);
    setShowNameModal(false);
    handleSendMessage();
  };

  const handleQuoteMessage = (author: string, message: string, messageId: string) => {
    setQuotedMessage({ author, message, message_id: messageId });
  };

  const cancelQuote = () => {
    setQuotedMessage(null);
  };

  const toggleQuoteExpansion = (messageId: string) => {
    setExpandedQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const scrollToMessage = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('animate-pulse-slow');
      setTimeout(() => {
        element.classList.remove('animate-pulse-slow');
      }, 2000);
    }
  };

  const renderQuote = (quote: any, messageId: string, isClickable: boolean = false) => {
    const isExpanded = expandedQuotes.has(messageId);
    const shouldTruncate = quote.message_short && quote.message_short.length > 100;
    const displayText = isExpanded ? quote.message_short : 
      shouldTruncate ? quote.message_short.substring(0, 100) + '...' : quote.message_short;

    return (
      <div 
        className={`bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-primary p-3 rounded-r-lg mb-2 ${
          isClickable ? 'cursor-pointer hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 transition-all duration-200' : ''
        }`}
        onClick={isClickable ? () => scrollToMessage(quote.message_id || messageId) : undefined}
      >
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-xs">
            {quote.bot_name || quote.author}
          </Badge>
          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleQuoteExpansion(messageId);
              }}
            >
              {isExpanded ? 'Скрыть' : 'Показать больше'}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground italic">
          {displayText}
        </p>
      </div>
    );
  };

  const formatTime = (time: string) => {
    const now = new Date();
    const today = now.toDateString();
    const messageDate = new Date();
    
    // Для демо всегда показываем "сегодня"
    return `Сегодня в ${time}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Заголовок */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Bot Chat Simulator
              </h1>
              <p className="text-sm text-muted-foreground">
                Живое общение ботов • {displayedBotMessages.length + userMessages.length} сообщений
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[70vh] flex flex-col shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Область чата */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Сообщения ботов */}
            {displayedBotMessages.map((message, index) => (
              <div 
                key={message.id}
                ref={el => messageRefs.current[message.id] = el}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    style={{ backgroundColor: message.avatar_color }}
                  >
                    {message.bot_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{message.bot_name}</span>
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Bot" size={12} className="mr-1" />
                        Бот
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.time)}
                      </span>
                    </div>
                    
                    {/* Цитата в сообщении бота */}
                    {message.reply_to && renderQuote(message.reply_to, message.id)}
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-gray-800 leading-relaxed">{message.message}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-primary/10"
                        onClick={() => handleQuoteMessage(message.bot_name, message.message, message.id)}
                      >
                        <Icon name="Reply" size={14} className="mr-1" />
                        Ответить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Сообщения пользователя */}
            {userMessages.map((message) => (
              <div 
                key={message.id}
                ref={el => messageRefs.current[message.id] = el}
                className="animate-slide-in-right"
              >
                <div className="flex items-start space-x-3 mb-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {message.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1 justify-end">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.time)}
                      </span>
                      <Badge variant="default" className="text-xs bg-gradient-to-r from-primary to-secondary">
                        <Icon name="User" size={12} className="mr-1" />
                        {message.user_name}
                      </Badge>
                    </div>
                    
                    {/* Цитата в сообщении пользователя */}
                    {message.reply_to && (
                      <div className="mb-2">
                        {renderQuote(message.reply_to, message.id, true)}
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white shadow-lg">
                      <p className="leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Индикатор набора */}
            {isTyping && (
              <div className="flex items-center space-x-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Icon name="MessageCircle" size={16} className="text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Область ввода */}
          <div className="border-t border-gray-200 p-4 bg-white/50">
            {/* Плашка цитирования */}
            {quotedMessage && (
              <div className="mb-3 animate-scale-in">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Ответ на сообщение от {quotedMessage.author}:
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelQuote}
                      className="h-6 w-6 p-0"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {quotedMessage.message.length > 100 
                      ? quotedMessage.message.substring(0, 100) + '...'
                      : quotedMessage.message
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Введите ваше сообщение..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-white border-gray-300 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                disabled={!userInput.trim()}
              >
                <Icon name="Send" size={16} className="mr-2" />
                Отправить
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Модальное окно для ввода имени */}
      <Dialog open={showNameModal} onOpenChange={setShowNameModal}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-center text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Добро пожаловать в чат!
            </DialogTitle>
            <DialogDescription className="text-center">
              Представьтесь, чтобы другие участники могли обращаться к вам по имени
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Ваше имя
              </Label>
              <Input
                id="username"
                placeholder="Введите ваше имя"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveUserName()}
                className="mt-1"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNameModal(false)}>
                Отмена
              </Button>
              <Button 
                onClick={handleSaveUserName}
                disabled={!userName.trim()}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;