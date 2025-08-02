import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
  animationSpeed: string;
  gradientType: string;
}

interface DesignTabProps {
  designSettings: DesignSettings;
  onDesignSettingsChange: (settings: Partial<DesignSettings>) => void;
  onApplyDesign: () => void;
}

const DesignTab: React.FC<DesignTabProps> = ({
  designSettings,
  onDesignSettingsChange,
  onApplyDesign
}) => {
  const presetColors = [
    { name: 'Purple Dream', primary: '#6C5CE7', secondary: '#74B9FF', accent: '#00B894' },
    { name: 'Ocean Breeze', primary: '#0984e3', secondary: '#74b9ff', accent: '#00cec9' },
    { name: 'Sunset Glow', primary: '#e17055', secondary: '#fdcb6e', accent: '#e84393' },
    { name: 'Forest Fresh', primary: '#00b894', secondary: '#55a3ff', accent: '#fd79a8' },
    { name: 'Dark Mode', primary: '#2d3436', secondary: '#636e72', accent: '#6c5ce7' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Настройки дизайна</h2>
        <p className="text-muted-foreground">Кастомизируйте внешний вид чата</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Цветовая схема</CardTitle>
            <CardDescription>Настройте основные цвета интерфейса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Основной цвет</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={designSettings.primaryColor}
                    onChange={(e) => onDesignSettingsChange({ primaryColor: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={designSettings.primaryColor}
                    onChange={(e) => onDesignSettingsChange({ primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Вторичный цвет</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={designSettings.secondaryColor}
                    onChange={(e) => onDesignSettingsChange({ secondaryColor: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={designSettings.secondaryColor}
                    onChange={(e) => onDesignSettingsChange({ secondaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Акцентный цвет</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={designSettings.accentColor}
                    onChange={(e) => onDesignSettingsChange({ accentColor: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={designSettings.accentColor}
                    onChange={(e) => onDesignSettingsChange({ accentColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Цвет фона</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={designSettings.backgroundColor}
                    onChange={(e) => onDesignSettingsChange({ backgroundColor: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={designSettings.backgroundColor}
                    onChange={(e) => onDesignSettingsChange({ backgroundColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base">Готовые темы</Label>
              <div className="grid gap-2 mt-2">
                {presetColors.map(preset => (
                  <div 
                    key={preset.name}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => onDesignSettingsChange({
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                      accentColor: preset.accent
                    })}
                  >
                    <span className="font-medium">{preset.name}</span>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Типография и анимации</CardTitle>
            <CardDescription>Настройте шрифты и эффекты</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Семейство шрифтов</Label>
              <Select 
                value={designSettings.fontFamily} 
                onValueChange={(value) => onDesignSettingsChange({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Радиус скругления</Label>
              <Select 
                value={designSettings.borderRadius} 
                onValueChange={(value) => onDesignSettingsChange({ borderRadius: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4px">Минимальное (4px)</SelectItem>
                  <SelectItem value="8px">Среднее (8px)</SelectItem>
                  <SelectItem value="12px">Большое (12px)</SelectItem>
                  <SelectItem value="16px">Очень большое (16px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Скорость анимации</Label>
              <Select 
                value={designSettings.animationSpeed} 
                onValueChange={(value) => onDesignSettingsChange({ animationSpeed: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200ms">Быстрая (200ms)</SelectItem>
                  <SelectItem value="300ms">Средняя (300ms)</SelectItem>
                  <SelectItem value="500ms">Медленная (500ms)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Тип градиента</Label>
              <Select 
                value={designSettings.gradientType} 
                onValueChange={(value) => onDesignSettingsChange({ gradientType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Линейный</SelectItem>
                  <SelectItem value="radial">Радиальный</SelectItem>
                  <SelectItem value="conic">Конический</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onApplyDesign} className="w-full">
              <Icon name="Paintbrush" size={16} className="mr-2" />
              Применить дизайн
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Превью */}
      <Card>
        <CardHeader>
          <CardTitle>Предварительный просмотр</CardTitle>
          <CardDescription>Как будет выглядеть чат с выбранными настройками</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              background: `linear-gradient(135deg, ${designSettings.primaryColor}20, ${designSettings.secondaryColor}20)`,
              fontFamily: designSettings.fontFamily 
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: designSettings.primaryColor }}
                >
                  A
                </div>
                <div 
                  className="flex-1 p-3 rounded-lg text-white"
                  style={{ background: `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.secondaryColor})` }}
                >
                  Пример сообщения бота с новыми настройками дизайна
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-end">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: designSettings.accentColor, color: 'white' }}
                >
                  Ответ пользователя
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: designSettings.accentColor }}
                >
                  У
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignTab;