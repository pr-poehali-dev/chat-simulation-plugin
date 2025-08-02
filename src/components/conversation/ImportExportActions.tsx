import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { ConversationMessage, Bot } from './types';

interface ImportExportActionsProps {
  conversation: ConversationMessage[];
  bots: Bot[];
  jsonInput: string;
  setJsonInput: (json: string) => void;
  showJsonImport: boolean;
  setShowJsonImport: (show: boolean) => void;
  onImportFromJson: () => void;
  onExportToJson: () => void;
  onClearConversation: () => void;
}

const ImportExportActions: React.FC<ImportExportActionsProps> = ({
  conversation,
  bots,
  jsonInput,
  setJsonInput,
  showJsonImport,
  setShowJsonImport,
  onImportFromJson,
  onExportToJson,
  onClearConversation
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button onClick={onExportToJson} variant="outline">
        <Icon name="Download" size={16} className="mr-2" />
        Экспорт JSON
      </Button>
      
      <Dialog open={showJsonImport} onOpenChange={setShowJsonImport}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Icon name="Upload" size={16} className="mr-2" />
            Импорт JSON
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Импорт переписки из JSON</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">Формат JSON для импорта:</p>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`{
  "conversation": [
    {
      "id": "msg_1",
      "bot_name": "AI Assistant",
      "message": "Привет! Как дела?",
      "time": "14:30",
      "avatar_color": "#6C5CE7",
      "delay_seconds": 2
    }
  ],
  "bots": [
    {
      "id": "bot_1",
      "name": "ai_assistant", 
      "displayName": "AI Assistant",
      "avatar_color": "#6C5CE7",
      "personality": "Дружелюбный ассистент",
      "isActive": true
    }
  ]
}`}
              </pre>
            </div>
            <Textarea
              placeholder="Вставьте JSON данные переписки в указанном выше формате..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={8}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowJsonImport(false)}>
                Отмена
              </Button>
              <Button onClick={onImportFromJson}>
                Импортировать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button onClick={onClearConversation} variant="destructive">
        <Icon name="Trash2" size={16} className="mr-2" />
        Очистить
      </Button>
    </div>
  );
};

export default ImportExportActions;