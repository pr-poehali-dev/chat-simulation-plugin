import React, { useState, useEffect } from 'react';
import { ConversationMessage, Bot } from './conversation/types';
import MessageForm from './conversation/MessageForm';
import MessageList from './conversation/MessageList';
import PreviewPanel from './conversation/PreviewPanel';
import ImportExportActions from './conversation/ImportExportActions';
import { useToast } from '@/hooks/use-toast';

const ConversationEditor = () => {
  const { toast } = useToast();
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
        const loadedConversation = JSON.parse(savedConversation);
        setConversation(loadedConversation);
        console.log('Переписка загружена из localStorage:', loadedConversation.length, 'сообщений');
      } catch (e) {
        console.error('Error loading conversation:', e);
      }
    }
    
    if (savedBots) {
      try {
        const loadedBots = JSON.parse(savedBots);
        // Объединяем загруженных ботов с дефолтными, убирая дубликаты
        const mergedBots = [
          ...loadedBots,
          ...bots.filter(defaultBot => 
            !loadedBots.some((loadedBot: Bot) => loadedBot.name === defaultBot.name)
          )
        ];
        setBots(mergedBots);
        console.log('Боты загружены из localStorage:', mergedBots.length, 'ботов');
      } catch (e) {
        console.error('Error loading bots:', e);
      }
    }
  }, []);

  // Сохранение переписки
  const saveConversation = (newConversation = conversation) => {
    localStorage.setItem('botConversation', JSON.stringify(newConversation));
    // Также дублируем в chatMessages для обратной совместимости
    localStorage.setItem('chatMessages', JSON.stringify(newConversation));
    console.log('💾 Переписка сохранена:', newConversation.length, 'сообщений');
    
    // Триггерим обновление чата через событие
    window.dispatchEvent(new CustomEvent('conversation-updated', {
      detail: { conversation: newConversation }
    }));
    
    console.log('📡 Событие conversation-updated отправлено');
  };

  // Добавление нового сообщения
  const addMessage = () => {
    console.log('🔥 ФУНКЦИЯ addMessage ВЫЗВАНА!');
    console.log('📝 Попытка добавить сообщение:', newMessage);
    console.log('🤖 Доступные боты:', bots);
    console.log('💬 Текущая переписка:', conversation);
    
    if (!newMessage.bot_name || !newMessage.message.trim()) {
      console.log('❌ Ошибка: не заполнены обязательные поля');
      alert('Выберите бота и введите текст сообщения');
      return;
    }

    const selectedBot = bots.find(bot => bot.displayName === newMessage.bot_name);
    console.log('🔍 Ищем бота с именем:', newMessage.bot_name);
    console.log('✅ Найденный бот:', selectedBot);
    
    if (!selectedBot) {
      console.log('❌ Ошибка: бот не найден');
      alert('Выбранный бот не найден');
      return;
    }

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

    console.log('✨ Создаём сообщение:', message);

    const newConversation = [...conversation, message];
    console.log('📋 Новая переписка:', newConversation);
    
    setConversation(newConversation);
    setNewMessage({
      bot_name: '',
      message: '',
      time: '',
      reply_to_id: '',
      delay_seconds: 3
    });
    setShowAddMessage(false);
    saveConversation(newConversation);
    
    console.log('✅ Сообщение успешно добавлено!');
  };

  // Удаление сообщения
  const deleteMessage = (messageId: string) => {
    const newConversation = conversation.filter(msg => msg.id !== messageId);
    setConversation(newConversation);
    saveConversation(newConversation);
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

    const newConversation = conversation.map(msg => 
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
    );
    
    setConversation(newConversation);
    setEditingMessageId(null);
    setNewMessage({
      bot_name: '',
      message: '',
      time: '',
      reply_to_id: '',
      delay_seconds: 3
    });
    setShowAddMessage(false);
    saveConversation(newConversation);
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
    saveConversation(newConversation);
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
    
    toast({
      title: "Экспорт завершен",
      description: "Файл переписки сохранен на ваш компьютер",
    });
  };

  // Импорт из JSON
  const importFromJson = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (data.conversation && Array.isArray(data.conversation)) {
        setConversation(data.conversation);
        saveConversation(data.conversation);
        setJsonInput('');
        setShowJsonImport(false);
        toast({
          title: "Переписка импортирована",
          description: `Загружено ${data.conversation.length} сообщений`,
        });
      } else {
        toast({
          title: "Ошибка импорта",
          description: "Неверный формат JSON: отсутствует поле conversation",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Ошибка импорта",
        description: "Ошибка парсинга JSON",
        variant: "destructive",
      });
    }
  };

  // Очистка переписки
  const clearConversation = () => {
    if (confirm('Вы уверены, что хотите очистить всю переписку?')) {
      const emptyConversation: ConversationMessage[] = [];
      setConversation(emptyConversation);
      saveConversation(emptyConversation);
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
        <ImportExportActions
          conversation={conversation}
          bots={bots}
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          showJsonImport={showJsonImport}
          setShowJsonImport={setShowJsonImport}
          onImportFromJson={importFromJson}
          onExportToJson={exportToJson}
          onClearConversation={clearConversation}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Список сообщений */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <MessageForm
              showAddMessage={showAddMessage}
              setShowAddMessage={setShowAddMessage}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              bots={bots}
              conversation={conversation}
              onAddMessage={addMessage}
              onSaveEdit={saveEdit}
              generateTime={generateTime}
            />
          </div>
          <MessageList
            conversation={conversation}
            onMoveMessage={moveMessage}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
          />
        </div>

        {/* Превью и инструкции */}
        <PreviewPanel conversation={conversation} />
      </div>
    </div>
  );
};

export default ConversationEditor;