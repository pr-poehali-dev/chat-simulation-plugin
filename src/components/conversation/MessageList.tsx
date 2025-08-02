import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ConversationMessage } from './types';

interface MessageListProps {
  conversation: ConversationMessage[];
  onMoveMessage: (messageId: string, direction: 'up' | 'down') => void;
  onEditMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  conversation,
  onMoveMessage,
  onEditMessage,
  onDeleteMessage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Переписка ботов</CardTitle>
        <CardDescription>
          {conversation.length} сообщений • Общая длительность: {conversation.reduce((sum, msg) => sum + msg.delay_seconds, 0)}с
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Переписка пуста. Добавьте первое сообщение.</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div key={message.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: message.avatar_color }}
                    >
                      {message.bot_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{message.bot_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{message.time}</span>
                        <Badge variant="outline" className="text-xs">
                          +{message.delay_seconds}s
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveMessage(message.id, 'up')}
                      disabled={index === 0}
                    >
                      <Icon name="ChevronUp" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveMessage(message.id, 'down')}
                      disabled={index === conversation.length - 1}
                    >
                      <Icon name="ChevronDown" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMessage(message.id)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteMessage(message.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                {/* Цитата если есть */}
                {message.reply_to && (
                  <div className="bg-gray-50 border-l-4 border-primary p-3 rounded-r-lg">
                    <p className="text-sm font-medium">{message.reply_to.bot_name}</p>
                    <p className="text-sm text-muted-foreground italic">
                      {message.reply_to.message_short}
                    </p>
                  </div>
                )}

                <p className="text-gray-800">{message.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageList;