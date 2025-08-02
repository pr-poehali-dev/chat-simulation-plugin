import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface ExportData {
  bots: any[];
  telegramSettings: any;
  designSettings: any;
  chatMessages: any[];
}

interface ExportInterfaceProps {
  exportData: ExportData | null;
  generatedCode: string;
  onLoadExportData: () => void;
  onDownloadAllFiles: () => void;
}

const ExportInterface: React.FC<ExportInterfaceProps> = ({
  exportData,
  generatedCode,
  onLoadExportData,
  onDownloadAllFiles
}) => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon name="Download" size={24} />
          <span>Экспорт WordPress плагина</span>
        </CardTitle>
        <CardDescription>
          Создайте готовый к использованию WordPress плагин с вашими настройками
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Button onClick={onLoadExportData} className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="FileCode" size={16} className="mr-2" />
              Сгенерировать плагин
            </Button>
            {generatedCode && (
              <Button onClick={onDownloadAllFiles} variant="outline">
                <Icon name="Download" size={16} className="mr-2" />
                Скачать все файлы
              </Button>
            )}
          </div>

          {exportData && (
            <Alert>
              <Icon name="CheckCircle" className="h-4 w-4" />
              <AlertDescription>
                Данные успешно загружены: {exportData.bots.length} ботов, настройки дизайна и Telegram интеграция
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportInterface;