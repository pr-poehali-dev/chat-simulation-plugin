import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface Bot {
  id: string;
  displayName: string;
  isActive: boolean;
}

interface TelegramSettings {
  botToken: string;
  chatId: string;
  isConnected: boolean;
  webhookUrl: string;
}

interface TelegramTabProps {
  telegramSettings: TelegramSettings;
  bots: Bot[];
  onTelegramSettingsChange: (settings: Partial<TelegramSettings>) => void;
  onTestConnection: () => void;
}

const TelegramTab: React.FC<TelegramTabProps> = ({
  telegramSettings,
  bots,
  onTelegramSettingsChange,
  onTestConnection
}) => {
  return (
    <div className="space-y-6">
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
              onChange={(e) => onTelegramSettingsChange({ botToken: e.target.value })}
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
              onChange={(e) => onTelegramSettingsChange({ chatId: e.target.value })}
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
              onChange={(e) => onTelegramSettingsChange({ webhookUrl: e.target.value })}
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL для получения ответов от администратора
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={onTestConnection}>
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
    </div>
  );
};

export default TelegramTab;