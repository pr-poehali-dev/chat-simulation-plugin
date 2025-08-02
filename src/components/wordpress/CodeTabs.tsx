import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ExportData {
  bots: any[];
  telegramSettings: any;
  designSettings: any;
  chatMessages: any[];
}

interface CodeTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  generatedCode: string;
  exportData: ExportData | null;
  generateCSSFile: (data: ExportData) => string;
  generateJSFile: (data: ExportData) => string;
  generateChatTemplate: () => string;
  generateAdminPage: () => string;
  downloadFile: (content: string, filename: string) => void;
}

const CodeTabs: React.FC<CodeTabsProps> = ({
  activeTab,
  onTabChange,
  generatedCode,
  exportData,
  generateCSSFile,
  generateJSFile,
  generateChatTemplate,
  generateAdminPage,
  downloadFile
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="main">Основной файл</TabsTrigger>
        <TabsTrigger value="css">Стили CSS</TabsTrigger>
        <TabsTrigger value="js">JavaScript</TabsTrigger>
        <TabsTrigger value="template">Шаблон</TabsTrigger>
        <TabsTrigger value="admin">Админка</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4">
        <div>
          <Label>ai-bot-chat-simulator.php</Label>
          <Textarea
            value={generatedCode}
            readOnly
            className="h-96 font-mono text-sm"
          />
        </div>
        <Button onClick={() => downloadFile(generatedCode, 'ai-bot-chat-simulator.php')}>
          <Icon name="Download" size={16} className="mr-2" />
          Скачать основной файл
        </Button>
      </TabsContent>

      <TabsContent value="css" className="space-y-4">
        <div>
          <Label>assets/chat.css</Label>
          <Textarea
            value={exportData ? generateCSSFile(exportData) : ''}
            readOnly
            className="h-96 font-mono text-sm"
          />
        </div>
        <Button onClick={() => exportData && downloadFile(generateCSSFile(exportData), 'chat.css')}>
          <Icon name="Download" size={16} className="mr-2" />
          Скачать CSS
        </Button>
      </TabsContent>

      <TabsContent value="js" className="space-y-4">
        <div>
          <Label>assets/chat.js</Label>
          <Textarea
            value={exportData ? generateJSFile(exportData) : ''}
            readOnly
            className="h-96 font-mono text-sm"
          />
        </div>
        <Button onClick={() => exportData && downloadFile(generateJSFile(exportData), 'chat.js')}>
          <Icon name="Download" size={16} className="mr-2" />
          Скачать JavaScript
        </Button>
      </TabsContent>

      <TabsContent value="template" className="space-y-4">
        <div>
          <Label>templates/chat.php</Label>
          <Textarea
            value={generateChatTemplate()}
            readOnly
            className="h-96 font-mono text-sm"
          />
        </div>
        <Button onClick={() => downloadFile(generateChatTemplate(), 'chat.php')}>
          <Icon name="Download" size={16} className="mr-2" />
          Скачать шаблон
        </Button>
      </TabsContent>

      <TabsContent value="admin" className="space-y-4">
        <div>
          <Label>admin/admin-page.php</Label>
          <Textarea
            value={generateAdminPage()}
            readOnly
            className="h-96 font-mono text-sm"
          />
        </div>
        <Button onClick={() => downloadFile(generateAdminPage(), 'admin-page.php')}>
          <Icon name="Download" size={16} className="mr-2" />
          Скачать админку
        </Button>
      </TabsContent>
    </Tabs>
  );
};

export default CodeTabs;