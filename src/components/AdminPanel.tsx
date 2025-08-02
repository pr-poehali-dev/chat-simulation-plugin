import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import WordPressExporter from '@/components/WordPressExporter';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import ConversationEditor from '@/components/ConversationEditor';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardTab from '@/components/admin/DashboardTab';
import BotsTab from '@/components/admin/BotsTab';
import TelegramTab from '@/components/admin/TelegramTab';
import MessagesTab from '@/components/admin/MessagesTab';
import DesignTab from '@/components/admin/DesignTab';
import ReplyDialog from '@/components/admin/ReplyDialog';

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

  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);

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

  const [selectedBot, setSelectedBot] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedBots = localStorage.getItem('adminBots');
    const savedTelegram = localStorage.getItem('telegramSettings');
    const savedDesign = localStorage.getItem('designSettings');
    const savedTab = localStorage.getItem('admin-tab');
    const savedUserMessages = localStorage.getItem('userMessages');

    if (savedBots) setBots(JSON.parse(savedBots));
    if (savedTelegram) setTelegramSettings(JSON.parse(savedTelegram));
    if (savedDesign) setDesignSettings(JSON.parse(savedDesign));
    if (savedUserMessages) {
      try {
        setUserMessages(JSON.parse(savedUserMessages));
      } catch (e) {
        console.error('Error loading user messages:', e);
      }
    }
    
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem('admin-tab');
    }
    
    const handleUserMessage = (event: CustomEvent) => {
      console.log('🔔 Получено новое сообщение пользователя:', event.detail);
      const allUserMessages = event.detail.allMessages;
      setUserMessages(allUserMessages);
    };
    
    window.addEventListener('user-message-added', handleUserMessage as EventListener);
    
    return () => {
      window.removeEventListener('user-message-added', handleUserMessage as EventListener);
    };
  }, []);

  // Сохранение настроек
  const saveSettings = () => {
    try {
      localStorage.setItem('adminBots', JSON.stringify(bots));
      localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings));
      localStorage.setItem('designSettings', JSON.stringify(designSettings));
      localStorage.setItem('userMessages', JSON.stringify(userMessages));
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '✅ Настройки сохранены!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
      console.log('✅ Настройки успешно сохранены');
    } catch (error) {
      console.error('❌ Ошибка при сохранении:', error);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '❌ Ошибка при сохранении!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  // Добавление нового бота
  const handleAddBot = (newBotData: Omit<Bot, 'id' | 'name' | 'isActive' | 'messageCount' | 'lastActive'>) => {
    const bot: Bot = {
      id: `bot_${Date.now()}`,
      name: newBotData.displayName.toLowerCase().replace(/\s+/g, '_'),
      displayName: newBotData.displayName,
      avatar_color: newBotData.avatar_color,
      personality: newBotData.personality,
      isActive: true,
      messageCount: 0,
      lastActive: 'Только что создан'
    };

    setBots(prev => [...prev, bot]);
    setTimeout(saveSettings, 100);
  };

  // Удаление бота
  const handleDeleteBot = (botId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого бота?')) {
      setBots(prev => prev.filter(bot => bot.id !== botId));
      setTimeout(saveSettings, 100);
    }
  };

  // Переключение активности бота
  const toggleBotActive = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
    setTimeout(saveSettings, 100);
  };

  // Тестирование Telegram подключения
  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken) {
      alert('Введите Bot Token');
      return;
    }

    try {
      console.log('🤖 Тестируем Telegram API...');
      
      const response = await fetch(`https://api.telegram.org/bot${telegramSettings.botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setTelegramSettings(prev => ({ ...prev, isConnected: true }));
        saveSettings();
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `✅ Бот "${data.result.first_name}" подключён!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 5000);
        
        console.log('✅ Telegram бот подключён:', data.result);
      } else {
        throw new Error(data.description || 'Неверный токен');
      }
    } catch (error) {
      console.error('❌ Telegram connection failed:', error);
      setTelegramSettings(prev => ({ ...prev, isConnected: false }));
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `❌ Ошибка: ${error.message}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);
    }
  };

  // Отправка ответа пользователю через Telegram
  const sendReply = async () => {
    if (!currentMessage || !selectedBot || !replyMessage.trim()) return;

    const selectedBotData = bots.find(bot => bot.id === selectedBot);
    if (!selectedBotData) return;

    try {
      if (telegramSettings.isConnected && telegramSettings.botToken && telegramSettings.chatId) {
        const message = `🤖 ${selectedBotData.displayName}: ${replyMessage}`;
        
        const response = await fetch(`https://api.telegram.org/bot${telegramSettings.botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramSettings.chatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const result = await response.json();
        if (result.ok) {
          console.log('✅ Ответ отправлен в Telegram:', result.result);
        } else {
          throw new Error(result.description || 'Ошибка отправки');
        }
      }
      
      const updatedMessages = userMessages.map(msg => 
        msg.id === currentMessage.id ? { ...msg, replied: true } : msg
      );
      setUserMessages(updatedMessages);
      localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '✅ Ответ отправлен!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Ошибка отправки:', error);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `❌ Ошибка: ${error.message}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }

    setShowReplyDialog(false);
    setReplyMessage('');
    setSelectedBot('');
    setCurrentMessage(null);
  };

  const openReplyDialog = (message: ChatMessage) => {
    setCurrentMessage(message);
    setShowReplyDialog(true);
  };

  // Применение дизайна в реальном времени
  const applyDesign = () => {
    try {
      document.documentElement.style.setProperty('--design-primary-color', designSettings.primaryColor);
      document.documentElement.style.setProperty('--design-secondary-color', designSettings.secondaryColor);
      document.documentElement.style.setProperty('--design-accent-color', designSettings.accentColor);
      document.documentElement.style.setProperty('--design-background-color', designSettings.backgroundColor);
      document.documentElement.style.setProperty('--design-font-family', designSettings.fontFamily);
      document.documentElement.style.setProperty('--design-border-radius', designSettings.borderRadius);
      document.documentElement.style.setProperty('--design-animation-speed', designSettings.animationSpeed);
      
      document.body.classList.add('design-apply');
      
      window.dispatchEvent(new CustomEvent('design-updated', {
        detail: { settings: designSettings }
      }));
      
      saveSettings();
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.style.background = `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.secondaryColor})`;
      notification.textContent = '✨ Дизайн применён в реальном времени!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
      console.log('✨ Дизайн успешно применён:', designSettings);
    } catch (error) {
      console.error('❌ Ошибка при применении дизайна:', error);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `❌ Ошибка: ${error.message}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminHeader 
        telegramSettings={telegramSettings} 
        onSaveSettings={saveSettings} 
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-fit">
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

          <TabsContent value="dashboard">
            <DashboardTab 
              bots={bots} 
              userMessages={userMessages} 
              telegramSettings={telegramSettings} 
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="conversation">
            <ConversationEditor />
          </TabsContent>

          <TabsContent value="bots">
            <BotsTab
              bots={bots}
              onAddBot={handleAddBot}
              onDeleteBot={handleDeleteBot}
              onToggleBotActive={toggleBotActive}
            />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab
              userMessages={userMessages}
              onOpenReplyDialog={openReplyDialog}
            />
          </TabsContent>

          <TabsContent value="telegram">
            <TelegramTab
              telegramSettings={telegramSettings}
              bots={bots}
              onTelegramSettingsChange={(settings) => setTelegramSettings(prev => ({ ...prev, ...settings }))}
              onTestConnection={testTelegramConnection}
            />
          </TabsContent>

          <TabsContent value="design">
            <DesignTab
              designSettings={designSettings}
              onDesignSettingsChange={(settings) => setDesignSettings(prev => ({ ...prev, ...settings }))}
              onApplyDesign={applyDesign}
            />
          </TabsContent>

          <TabsContent value="export">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Экспорт WordPress плагина</h2>
              <p className="text-muted-foreground">Создайте готовый к использованию WordPress плагин</p>
            </div>
            <WordPressExporter />
          </TabsContent>
        </Tabs>

        <ReplyDialog
          open={showReplyDialog}
          onOpenChange={setShowReplyDialog}
          currentMessage={currentMessage}
          bots={bots}
          selectedBot={selectedBot}
          replyMessage={replyMessage}
          onSelectedBotChange={setSelectedBot}
          onReplyMessageChange={setReplyMessage}
          onSendReply={sendReply}
        />
      </div>
    </div>
  );
};

export default AdminPanel;