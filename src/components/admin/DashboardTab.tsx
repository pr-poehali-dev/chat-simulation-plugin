import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  time: string;
  replied: boolean;
}

interface TelegramSettings {
  isConnected: boolean;
}

interface DashboardTabProps {
  bots: Bot[];
  userMessages: ChatMessage[];
  telegramSettings: TelegramSettings;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  bots,
  userMessages,
  telegramSettings
}) => {
  return (
    <div className="space-y-6">
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
              {(() => {
                const conversation = JSON.parse(localStorage.getItem('botConversation') || '[]');
                const todayUserMessages = userMessages.filter(msg => {
                  const msgDate = new Date().toDateString();
                  return new Date().toDateString() === msgDate;
                });
                return conversation.length + todayUserMessages.length;
              })()} 
            </div>
            <p className="text-xs text-muted-foreground">
              {userMessages.length} от пользователей + {JSON.parse(localStorage.getItem('botConversation') || '[]').length} от ботов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(userMessages.map(msg => msg.user_name)).size || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {userMessages.length} сообщений от {new Set(userMessages.map(msg => msg.user_name)).size || 0} пользователей
            </p>
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
    </div>
  );
};

export default DashboardTab;