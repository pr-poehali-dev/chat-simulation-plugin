import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  time: string;
  replied: boolean;
}

interface MessagesTabProps {
  userMessages: ChatMessage[];
  onOpenReplyDialog: (message: ChatMessage) => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({
  userMessages,
  onOpenReplyDialog
}) => {
  return (
    <div className="space-y-6">
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
                      onClick={() => onOpenReplyDialog(message)}
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
    </div>
  );
};

export default MessagesTab;