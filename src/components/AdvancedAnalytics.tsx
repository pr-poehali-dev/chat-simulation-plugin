import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface AnalyticsData {
  totalMessages: number;
  totalUsers: number;
  activeUsers: number;
  averageResponseTime: number;
  botMessages: number;
  userMessages: number;
  todayMessages: number;
  yesterdayMessages: number;
  weeklyGrowth: number;
}

interface MessageActivity {
  time: string;
  messages: number;
  users: number;
}

interface BotPerformance {
  botName: string;
  messagesCount: number;
  responsesGiven: number;
  averageRating: number;
  popularityScore: number;
}

interface UserEngagement {
  hour: number;
  messageCount: number;
  userCount: number;
}

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalMessages: 1547,
    totalUsers: 342,
    activeUsers: 127,
    averageResponseTime: 1.8,
    botMessages: 892,
    userMessages: 655,
    todayMessages: 89,
    yesterdayMessages: 76,
    weeklyGrowth: 12.5
  });

  const [messageActivity, setMessageActivity] = useState<MessageActivity[]>([
    { time: '00:00', messages: 12, users: 5 },
    { time: '02:00', messages: 8, users: 3 },
    { time: '04:00', messages: 5, users: 2 },
    { time: '06:00', messages: 15, users: 8 },
    { time: '08:00', messages: 45, users: 23 },
    { time: '10:00', messages: 67, users: 34 },
    { time: '12:00', messages: 89, users: 45 },
    { time: '14:00', messages: 92, users: 51 },
    { time: '16:00', messages: 78, users: 38 },
    { time: '18:00', messages: 65, users: 29 },
    { time: '20:00', messages: 43, users: 18 },
    { time: '22:00', messages: 28, users: 12 }
  ]);

  const [botPerformance, setBotPerformance] = useState<BotPerformance[]>([
    {
      botName: 'AI Assistant',
      messagesCount: 324,
      responsesGiven: 156,
      averageRating: 4.8,
      popularityScore: 95
    },
    {
      botName: 'Tech Bot',
      messagesCount: 287,
      responsesGiven: 89,
      averageRating: 4.6,
      popularityScore: 87
    },
    {
      botName: 'Data Guru',
      messagesCount: 189,
      responsesGiven: 67,
      averageRating: 4.7,
      popularityScore: 78
    },
    {
      botName: 'Code Master',
      messagesCount: 156,
      responsesGiven: 45,
      averageRating: 4.5,
      popularityScore: 71
    }
  ]);

  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([
    { hour: 0, messageCount: 12, userCount: 5 },
    { hour: 1, messageCount: 8, userCount: 3 },
    { hour: 2, messageCount: 5, userCount: 2 },
    { hour: 3, messageCount: 4, userCount: 2 },
    { hour: 4, messageCount: 6, userCount: 3 },
    { hour: 5, messageCount: 8, userCount: 4 },
    { hour: 6, messageCount: 15, userCount: 8 },
    { hour: 7, messageCount: 25, userCount: 12 },
    { hour: 8, messageCount: 45, userCount: 23 },
    { hour: 9, messageCount: 67, userCount: 34 },
    { hour: 10, messageCount: 89, userCount: 45 },
    { hour: 11, messageCount: 78, userCount: 38 },
    { hour: 12, messageCount: 92, userCount: 51 },
    { hour: 13, messageCount: 85, userCount: 42 },
    { hour: 14, messageCount: 78, userCount: 38 },
    { hour: 15, messageCount: 71, userCount: 35 },
    { hour: 16, messageCount: 65, userCount: 29 },
    { hour: 17, messageCount: 58, userCount: 26 },
    { hour: 18, messageCount: 52, userCount: 23 },
    { hour: 19, messageCount: 43, userCount: 18 },
    { hour: 20, messageCount: 36, userCount: 15 },
    { hour: 21, messageCount: 28, userCount: 12 },
    { hour: 22, messageCount: 21, userCount: 9 },
    { hour: 23, messageCount: 15, userCount: 6 }
  ]);

  // Простая реализация линейного графика
  const SimpleLineChart = ({ data, xKey, yKey, color = '#6C5CE7', title }: any) => {
    const maxValue = Math.max(...data.map((item: any) => item[yKey]));
    const width = 400;
    const height = 200;
    const padding = 40;

    const points = data.map((item: any, index: number) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((item[yKey] / maxValue) * (height - padding * 2));
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        <svg width={width} height={height} className="border rounded">
          {/* Сетка */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Линия графика */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={points}
            className="drop-shadow-sm"
          />
          
          {/* Точки */}
          {data.map((item: any, index: number) => {
            const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - padding - ((item[yKey] / maxValue) * (height - padding * 2));
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="drop-shadow-sm hover:r-6 transition-all duration-200"
              />
            );
          })}
          
          {/* Подписи оси X */}
          {data.map((item: any, index: number) => {
            if (index % Math.ceil(data.length / 6) === 0) {
              const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
              return (
                <text
                  key={index}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item[xKey]}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  };

  // Простая реализация столбчатого графика
  const SimpleBarChart = ({ data, xKey, yKey, color = '#74B9FF', title }: any) => {
    const maxValue = Math.max(...data.map((item: any) => item[yKey]));
    const width = 400;
    const height = 200;
    const padding = 40;
    const barWidth = (width - padding * 2) / data.length - 4;

    return (
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        <svg width={width} height={height} className="border rounded">
          {/* Сетка */}
          <defs>
            <pattern id="barGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#barGrid)" />
          
          {/* Столбцы */}
          {data.map((item: any, index: number) => {
            const x = (index * (width - padding * 2)) / data.length + padding + 2;
            const barHeight = (item[yKey] / maxValue) * (height - padding * 2);
            const y = height - padding - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className="hover:opacity-80 transition-opacity duration-200"
                  rx="2"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item[xKey]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Круговая диаграмма
  const SimplePieChart = ({ data, title }: any) => {
    const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
    const colors = ['#6C5CE7', '#74B9FF', '#00B894', '#E17055', '#FDCB6E'];
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        <div className="flex items-center space-x-4">
          <svg width="200" height="200">
            {data.map((item: any, index: number) => {
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
          </svg>
          
          <div className="space-y-2">
            {data.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm">{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const formatGrowth = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const exportAnalyticsData = () => {
    const dataToExport = {
      analyticsData,
      messageActivity,
      botPerformance,
      userEngagement,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Расширенная аналитика</h2>
          <p className="text-muted-foreground">Подробная статистика активности чата и производительности ботов</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 часа</SelectItem>
              <SelectItem value="7d">7 дней</SelectItem>
              <SelectItem value="30d">30 дней</SelectItem>
              <SelectItem value="90d">90 дней</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalyticsData} variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт данных
          </Button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего сообщений</CardTitle>
            <Icon name="MessageCircle" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalMessages.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              <Icon name={getGrowthIcon(analyticsData.weeklyGrowth)} className={`h-3 w-3 ${getGrowthColor(analyticsData.weeklyGrowth)}`} />
              <span className={getGrowthColor(analyticsData.weeklyGrowth)}>
                {formatGrowth(analyticsData.weeklyGrowth)} за неделю
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              из {analyticsData.totalUsers} всего пользователей
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время отклика</CardTitle>
            <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageResponseTime}с</div>
            <p className="text-xs text-muted-foreground">
              среднее время ответа ботов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
            <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.todayMessages}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-muted-foreground">вчера: {analyticsData.yesterdayMessages}</span>
              <span className={getGrowthColor(((analyticsData.todayMessages - analyticsData.yesterdayMessages) / analyticsData.yesterdayMessages) * 100)}>
                ({formatGrowth(((analyticsData.todayMessages - analyticsData.yesterdayMessages) / analyticsData.yesterdayMessages) * 100)})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Активность</TabsTrigger>
          <TabsTrigger value="bots">Производительность ботов</TabsTrigger>
          <TabsTrigger value="engagement">Вовлеченность</TabsTrigger>
          <TabsTrigger value="trends">Тренды</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Активность сообщений по времени</CardTitle>
                <CardDescription>Количество сообщений в течение дня</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart
                  data={messageActivity}
                  xKey="time"
                  yKey="messages"
                  color="#6C5CE7"
                  title="Сообщения по часам"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активность пользователей</CardTitle>
                <CardDescription>Уникальные пользователи по времени</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart
                  data={messageActivity}
                  xKey="time"
                  yKey="users"
                  color="#74B9FF"
                  title="Пользователи по часам"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Распределение типов сообщений</CardTitle>
              <CardDescription>Соотношение сообщений ботов и пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <SimplePieChart
                data={[
                  { label: 'Сообщения ботов', value: analyticsData.botMessages },
                  { label: 'Сообщения пользователей', value: analyticsData.userMessages }
                ]}
                title="Типы сообщений"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Производительность ботов</CardTitle>
                <CardDescription>Статистика активности и эффективности каждого бота</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {botPerformance.map((bot, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: ['#6C5CE7', '#74B9FF', '#00B894', '#E17055'][index] }}
                          >
                            {bot.botName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{bot.botName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {bot.messagesCount} сообщений • {bot.responsesGiven} ответов
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          ⭐ {bot.averageRating}/5.0
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Популярность</span>
                            <span>{bot.popularityScore}%</span>
                          </div>
                          <Progress value={bot.popularityScore} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Отклик на сообщения</span>
                            <span>{((bot.responsesGiven / bot.messagesCount) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(bot.responsesGiven / bot.messagesCount) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сравнение активности ботов</CardTitle>
                <CardDescription>Количество сообщений каждого бота</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={botPerformance.map(bot => ({ name: bot.botName.split(' ')[0], count: bot.messagesCount }))}
                  xKey="name"
                  yKey="count"
                  color="#00B894"
                  title="Сообщения по ботам"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Почасовая активность пользователей</CardTitle>
              <CardDescription>Подробная статистика вовлеченности по часам</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={userEngagement.map(item => ({ hour: `${item.hour}:00`, count: item.messageCount }))}
                xKey="hour"
                yKey="count"
                color="#E17055"
                title="Сообщения по часам (24h)"
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Пиковые часы активности</CardTitle>
                <CardDescription>Самое активное время в чате</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userEngagement
                    .sort((a, b) => b.messageCount - a.messageCount)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span>{item.hour}:00 - {item.hour + 1}:00</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.messageCount} сообщений</div>
                          <div className="text-sm text-muted-foreground">{item.userCount} пользователей</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Средняя активность</CardTitle>
                <CardDescription>Ключевые показатели вовлеченности</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Среднее сообщений в час</span>
                    <span className="font-semibold">
                      {(userEngagement.reduce((sum, item) => sum + item.messageCount, 0) / 24).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Средне пользователей в час</span>
                    <span className="font-semibold">
                      {(userEngagement.reduce((sum, item) => sum + item.userCount, 0) / 24).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Сообщений на пользователя</span>
                    <span className="font-semibold">
                      {(analyticsData.totalMessages / analyticsData.totalUsers).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Активность ботов</span>
                    <span className="font-semibold">
                      {((analyticsData.botMessages / analyticsData.totalMessages) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Тренды роста</CardTitle>
                <CardDescription>Динамика развития чата</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="TrendingUp" className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Положительная динамика</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Количество сообщений увеличилось на {formatGrowth(analyticsData.weeklyGrowth)} за последнюю неделю
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Рост сообщений</span>
                      <span className={`font-semibold ${getGrowthColor(analyticsData.weeklyGrowth)}`}>
                        {formatGrowth(analyticsData.weeklyGrowth)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Новые пользователи</span>
                      <span className="font-semibold text-green-600">+8.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Активность ботов</span>
                      <span className="font-semibold text-blue-600">+15.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Прогнозы</CardTitle>
                <CardDescription>Ожидаемая активность</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="TrendingUp" className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Прогноз на следующую неделю</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Ожидается ~{Math.round(analyticsData.totalMessages * 1.125)} сообщений
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Ожидаемые сообщения</span>
                      <span className="font-semibold">~{Math.round(analyticsData.totalMessages * 1.125)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Новые пользователи</span>
                      <span className="font-semibold">~{Math.round(analyticsData.totalUsers * 0.08)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Нагрузка на ботов</span>
                      <Badge variant="outline">Средняя</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;