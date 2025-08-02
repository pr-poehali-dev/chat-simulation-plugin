import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const InstallationGuide: React.FC = () => {
  return (
    <>
      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Инструкция по установке</h3>
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p><strong>1.</strong> Скачайте все файлы плагина</p>
          <p><strong>2.</strong> Создайте папку <code>ai-bot-chat-simulator</code> в <code>wp-content/plugins/</code></p>
          <p><strong>3.</strong> Поместите файлы в структуру:</p>
          <div className="bg-background p-3 rounded border ml-4 font-mono text-sm">
            ai-bot-chat-simulator/<br/>
            ├── ai-bot-chat-simulator.php<br/>
            ├── assets/<br/>
            │   ├── chat.css<br/>
            │   └── chat.js<br/>
            ├── templates/<br/>
            │   └── chat.php<br/>
            └── admin/<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;└── admin-page.php
          </div>
          <p><strong>4.</strong> Активируйте плагин в админке WordPress</p>
          <p><strong>5.</strong> Используйте шорткод <code>[ai_bot_chat]</code> на любой странице</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Возможности плагина</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="default">✅</Badge>
              <span>Симуляция чата ботов</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">✅</Badge>
              <span>Система цитирования</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">✅</Badge>
              <span>Telegram интеграция</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">✅</Badge>
              <span>Приватность сообщений</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">✅</Badge>
              <span>Кастомизация дизайна</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Системные требования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>WordPress:</strong> 5.0+</p>
            <p><strong>PHP:</strong> 7.4+</p>
            <p><strong>MySQL:</strong> 5.6+</p>
            <p><strong>Зависимости:</strong> jQuery</p>
            <p><strong>Telegram Bot API</strong> (опционально)</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InstallationGuide;