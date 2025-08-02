import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TelegramSettings {
  isConnected: boolean;
}

interface AdminHeaderProps {
  telegramSettings: TelegramSettings;
  onSaveSettings: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  telegramSettings,
  onSaveSettings
}) => {
  return (
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
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться в чат
            </Button>
            <Button onClick={onSaveSettings} className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;