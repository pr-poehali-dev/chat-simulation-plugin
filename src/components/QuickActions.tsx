import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface QuickActionsProps {
  onOpenAdmin: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenAdmin }) => {
  const triggerConversationReload = () => {
    // Принудительно перезагружаем переписку из localStorage
    window.dispatchEvent(new CustomEvent('conversation-updated', {
      detail: { forced: true }
    }));
  };

  const openAdminWithConversationTab = () => {
    // Устанавливаем параметр для открытия на вкладке переписки
    localStorage.setItem('admin-tab', 'conversation');
    onOpenAdmin();
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm z-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Быстрые действия</CardTitle>
        <CardDescription className="text-xs">
          Управление чатом и перепиской
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          onClick={openAdminWithConversationTab}
          className="w-full bg-gradient-to-r from-primary to-secondary text-sm"
          size="sm"
        >
          <Icon name="MessageCircleMore" size={14} className="mr-2" />
          Редактор переписки
        </Button>
        
        <Button 
          onClick={onOpenAdmin}
          variant="outline"
          className="w-full text-sm"
          size="sm"
        >
          <Icon name="Settings" size={14} className="mr-2" />
          Админ-панель
        </Button>
        
        <Button 
          onClick={triggerConversationReload}
          variant="outline"
          className="w-full text-sm"
          size="sm"
        >
          <Icon name="RefreshCw" size={14} className="mr-2" />
          Обновить чат
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;