import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { ConversationMessage } from './types';

interface PreviewPanelProps {
  conversation: ConversationMessage[];
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ conversation }) => {
  return (
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
  );
};

export default PreviewPanel;