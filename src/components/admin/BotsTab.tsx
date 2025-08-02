import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

interface BotsTabProps {
  bots: Bot[];
  onAddBot: (bot: Omit<Bot, 'id' | 'name' | 'isActive' | 'messageCount' | 'lastActive'>) => void;
  onDeleteBot: (botId: string) => void;
  onToggleBotActive: (botId: string) => void;
}

const BotsTab: React.FC<BotsTabProps> = ({
  bots,
  onAddBot,
  onDeleteBot,
  onToggleBotActive
}) => {
  const [showAddBot, setShowAddBot] = useState(false);
  const [newBot, setNewBot] = useState({
    displayName: '',
    avatar_color: '#6C5CE7',
    personality: ''
  });

  const handleAddBot = () => {
    if (!newBot.displayName.trim()) return;

    onAddBot(newBot);
    setNewBot({ displayName: '', avatar_color: '#6C5CE7', personality: '' });
    setShowAddBot(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Управление ботами</h2>
          <p className="text-muted-foreground">Создавайте и настраивайте ботов для чата</p>
        </div>
        <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить бота
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать нового бота</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="botName">Имя бота</Label>
                <Input
                  id="botName"
                  placeholder="Например: Консультант Анна"
                  value={newBot.displayName}
                  onChange={(e) => setNewBot(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="botColor">Цвет аватара</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="botColor"
                    type="color"
                    value={newBot.avatar_color}
                    onChange={(e) => setNewBot(prev => ({ ...prev, avatar_color: e.target.value }))}
                    className="w-20"
                  />
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: newBot.avatar_color }}
                  >
                    {newBot.displayName.charAt(0) || '?'}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="botPersonality">Описание личности</Label>
                <Textarea
                  id="botPersonality"
                  placeholder="Дружелюбный консультант по продуктам компании..."
                  value={newBot.personality}
                  onChange={(e) => setNewBot(prev => ({ ...prev, personality: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddBot(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddBot}>Создать бота</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bots.map(bot => (
          <Card key={bot.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: bot.avatar_color }}
                  >
                    {bot.displayName.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{bot.displayName}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{bot.name}</p>
                  </div>
                </div>
                <Switch
                  checked={bot.isActive}
                  onCheckedChange={() => onToggleBotActive(bot.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{bot.personality}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{bot.messageCount} сообщений</span>
                <span>{bot.lastActive}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeleteBot(bot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BotsTab;