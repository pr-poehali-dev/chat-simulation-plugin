import React, { useState } from 'react';
import ExportInterface from '@/components/wordpress/ExportInterface';
import CodeTabs from '@/components/wordpress/CodeTabs';
import InstallationGuide from '@/components/wordpress/InstallationGuide';
import {
  generateWordPressPlugin,
  generateCSSFile,
  generateJSFile,
  generateChatTemplate,
  generateAdminPage
} from '@/components/wordpress/CodeGenerators';

interface ExportData {
  bots: any[];
  telegramSettings: any;
  designSettings: any;
  chatMessages: any[];
}

const WordPressExporter = () => {
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [activeTab, setActiveTab] = useState('main');

  // Загрузка данных для экспорта
  const loadExportData = () => {
    const bots = JSON.parse(localStorage.getItem('adminBots') || '[]');
    const telegramSettings = JSON.parse(localStorage.getItem('telegramSettings') || '{}');
    const designSettings = JSON.parse(localStorage.getItem('designSettings') || '{}');
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

    const data: ExportData = {
      bots,
      telegramSettings,
      designSettings,
      chatMessages
    };

    setExportData(data);
    const mainFile = generateWordPressPlugin(data);
    setGeneratedCode(mainFile);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    if (!exportData) return;

    // Основной файл плагина
    downloadFile(generatedCode, 'ai-bot-chat-simulator.php');
    
    // CSS файл
    setTimeout(() => {
      downloadFile(generateCSSFile(exportData), 'chat.css');
    }, 500);
    
    // JS файл
    setTimeout(() => {
      downloadFile(generateJSFile(exportData), 'chat.js');
    }, 1000);
    
    // Шаблон чата
    setTimeout(() => {
      downloadFile(generateChatTemplate(), 'chat.php');
    }, 1500);
    
    // Админская страница
    setTimeout(() => {
      downloadFile(generateAdminPage(), 'admin-page.php');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <ExportInterface
        exportData={exportData}
        generatedCode={generatedCode}
        onLoadExportData={loadExportData}
        onDownloadAllFiles={downloadAllFiles}
      />

      {generatedCode && (
        <CodeTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          generatedCode={generatedCode}
          exportData={exportData}
          generateCSSFile={generateCSSFile}
          generateJSFile={generateJSFile}
          generateChatTemplate={generateChatTemplate}
          generateAdminPage={generateAdminPage}
          downloadFile={downloadFile}
        />
      )}

      <InstallationGuide />
    </div>
  );
};

export default WordPressExporter;