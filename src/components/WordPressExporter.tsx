import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

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
    generateWordPressPlugin(data);
  };

  // Генерация основного файла плагина
  const generateWordPressPlugin = (data: ExportData) => {
    const mainFile = `<?php
/**
 * Plugin Name: AI Bot Chat Simulator
 * Plugin URI: https://example.com/ai-bot-chat-simulator
 * Description: Создает иллюзию живого общения ботов с возможностью участия пользователей и управления через Telegram
 * Version: 1.0.0
 * Author: AI Assistant
 * License: GPL v2 or later
 * Text Domain: ai-bot-chat
 * Domain Path: /languages
 */

// Предотвращаем прямой доступ
if (!defined('ABSPATH')) {
    exit;
}

// Константы плагина
define('AI_BOT_CHAT_VERSION', '1.0.0');
define('AI_BOT_CHAT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AI_BOT_CHAT_PLUGIN_URL', plugin_dir_url(__FILE__));

class AiBotChatSimulator {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_send_message', array($this, 'handle_send_message'));
        add_action('wp_ajax_nopriv_send_message', array($this, 'handle_send_message'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }

    public function init() {
        load_plugin_textdomain('ai-bot-chat', false, dirname(plugin_basename(__FILE__)) . '/languages');
        $this->create_tables();
        $this->init_default_data();
    }

    public function enqueue_scripts() {
        wp_enqueue_script('ai-bot-chat-script', AI_BOT_CHAT_PLUGIN_URL . 'assets/chat.js', array('jquery'), AI_BOT_CHAT_VERSION, true);
        wp_enqueue_style('ai-bot-chat-style', AI_BOT_CHAT_PLUGIN_URL . 'assets/chat.css', array(), AI_BOT_CHAT_VERSION);
        
        wp_localize_script('ai-bot-chat-script', 'aiBotChat', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ai_bot_chat_nonce'),
            'bots' => $this->get_bots(),
            'design' => $this->get_design_settings(),
            'messages' => $this->get_bot_messages()
        ));
    }

    public function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Таблица ботов
        $table_bots = $wpdb->prefix . 'ai_chat_bots';
        $sql_bots = "CREATE TABLE $table_bots (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            display_name varchar(100) NOT NULL,
            avatar_color varchar(7) NOT NULL,
            personality text,
            is_active tinyint(1) DEFAULT 1,
            message_count int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Таблица сообщений пользователей
        $table_messages = $wpdb->prefix . 'ai_chat_messages';
        $sql_messages = "CREATE TABLE $table_messages (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_name varchar(100) NOT NULL,
            user_ip varchar(45) NOT NULL,
            user_session varchar(100) NOT NULL,
            message text NOT NULL,
            reply_to_id mediumint(9) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            replied tinyint(1) DEFAULT 0,
            replied_by varchar(100) DEFAULT NULL,
            replied_at datetime DEFAULT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Таблица предзагруженных сообщений ботов
        $table_bot_messages = $wpdb->prefix . 'ai_chat_bot_messages';
        $sql_bot_messages = "CREATE TABLE $table_bot_messages (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            bot_id mediumint(9) NOT NULL,
            message text NOT NULL,
            reply_to_id mediumint(9) DEFAULT NULL,
            display_order int(11) NOT NULL,
            delay_seconds int(11) DEFAULT 3,
            is_active tinyint(1) DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Таблица настроек
        $table_settings = $wpdb->prefix . 'ai_chat_settings';
        $sql_settings = "CREATE TABLE $table_settings (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            setting_key varchar(100) NOT NULL UNIQUE,
            setting_value longtext,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_bots);
        dbDelta($sql_messages);
        dbDelta($sql_bot_messages);
        dbDelta($sql_settings);
    }

    public function init_default_data() {
        // Вставляем ботов из экспорта
        $bots = ${JSON.stringify(data.bots, null, 8)};
        
        foreach ($bots as $bot) {
            $this->insert_bot($bot);
        }

        // Вставляем настройки дизайна
        $design_settings = ${JSON.stringify(data.designSettings, null, 8)};
        $this->update_setting('design_settings', $design_settings);

        // Вставляем настройки Telegram
        $telegram_settings = ${JSON.stringify(data.telegramSettings, null, 8)};
        $this->update_setting('telegram_settings', $telegram_settings);
    }

    public function insert_bot($bot_data) {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_bots';
        
        $wpdb->insert(
            $table,
            array(
                'name' => $bot_data['name'],
                'display_name' => $bot_data['displayName'],
                'avatar_color' => $bot_data['avatar_color'],
                'personality' => $bot_data['personality'],
                'is_active' => $bot_data['isActive'] ? 1 : 0
            )
        );
    }

    public function handle_send_message() {
        check_ajax_referer('ai_bot_chat_nonce', 'nonce');

        $user_name = sanitize_text_field($_POST['user_name']);
        $message = sanitize_textarea_field($_POST['message']);
        $user_ip = $_SERVER['REMOTE_ADDR'];
        $user_session = session_id();

        // Сохраняем сообщение пользователя
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_messages';
        
        $wpdb->insert(
            $table,
            array(
                'user_name' => $user_name,
                'user_ip' => $user_ip,
                'user_session' => $user_session,
                'message' => $message
            )
        );

        $message_id = $wpdb->insert_id;

        // Отправляем уведомление в Telegram
        $this->send_telegram_notification($user_name, $message, $message_id);

        wp_send_json_success(array('message_id' => $message_id));
    }

    public function send_telegram_notification($user_name, $message, $message_id) {
        $telegram_settings = $this->get_setting('telegram_settings');
        
        if (empty($telegram_settings['botToken']) || empty($telegram_settings['chatId'])) {
            return false;
        }

        $text = "🔔 Новое сообщение от $user_name:\\n\\n$message\\n\\nВремя: " . current_time('H:i');
        
        // Создаем кнопки для ответа от разных ботов
        $bots = $this->get_bots();
        $keyboard = array();
        
        foreach ($bots as $bot) {
            if ($bot['is_active']) {
                $keyboard[] = array(
                    array(
                        'text' => "Ответить как " . $bot['display_name'],
                        'callback_data' => "reply_" . $message_id . "_" . $bot['id']
                    )
                );
            }
        }

        $data = array(
            'chat_id' => $telegram_settings['chatId'],
            'text' => $text,
            'reply_markup' => json_encode(array('inline_keyboard' => $keyboard))
        );

        $url = "https://api.telegram.org/bot" . $telegram_settings['botToken'] . "/sendMessage";
        
        wp_remote_post($url, array(
            'body' => $data,
            'timeout' => 30
        ));
    }

    public function register_rest_routes() {
        register_rest_route('ai-bot-chat/v1', '/telegram-webhook', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_telegram_webhook'),
            'permission_callback' => '__return_true'
        ));
    }

    public function handle_telegram_webhook($request) {
        $data = $request->get_json_params();
        
        if (isset($data['callback_query'])) {
            $callback_data = $data['callback_query']['data'];
            $chat_id = $data['callback_query']['message']['chat']['id'];
            
            if (strpos($callback_data, 'reply_') === 0) {
                $parts = explode('_', $callback_data);
                $message_id = $parts[1];
                $bot_id = $parts[2];
                
                // Отправляем запрос на ввод ответа
                $this->request_reply_message($chat_id, $message_id, $bot_id);
            }
        }
        
        if (isset($data['message']) && isset($data['message']['reply_to_message'])) {
            // Обрабатываем ответ администратора
            $this->process_admin_reply($data);
        }

        return new WP_REST_Response('OK', 200);
    }

    public function request_reply_message($chat_id, $message_id, $bot_id) {
        $telegram_settings = $this->get_setting('telegram_settings');
        $bot = $this->get_bot_by_id($bot_id);
        
        $text = "Введите ответ от имени бота \"" . $bot['display_name'] . "\":";
        
        $data = array(
            'chat_id' => $chat_id,
            'text' => $text,
            'reply_markup' => json_encode(array(
                'force_reply' => true,
                'selective' => true
            ))
        );

        $url = "https://api.telegram.org/bot" . $telegram_settings['botToken'] . "/sendMessage";
        
        wp_remote_post($url, array(
            'body' => $data,
            'timeout' => 30
        ));
    }

    public function process_admin_reply($data) {
        $reply_text = $data['message']['text'];
        $original_message = $data['message']['reply_to_message']['text'];
        
        // Извлекаем ID сообщения и бота из контекста
        // Здесь нужна дополнительная логика для связывания ответа с конкретным сообщением
        
        // Сохраняем ответ и отправляем пользователю
        $this->save_bot_reply($message_id, $bot_id, $reply_text);
    }

    public function save_bot_reply($message_id, $bot_id, $reply_text) {
        global $wpdb;
        
        // Обновляем статус сообщения
        $table = $wpdb->prefix . 'ai_chat_messages';
        $bot = $this->get_bot_by_id($bot_id);
        
        $wpdb->update(
            $table,
            array(
                'replied' => 1,
                'replied_by' => $bot['display_name'],
                'replied_at' => current_time('mysql')
            ),
            array('id' => $message_id)
        );

        // Отправляем ответ конкретному пользователю через WebSocket или AJAX polling
        // Здесь нужна дополнительная реализация для доставки ответа
    }

    public function get_bots() {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_bots';
        return $wpdb->get_results("SELECT * FROM $table WHERE is_active = 1", ARRAY_A);
    }

    public function get_bot_by_id($bot_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_bots';
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $bot_id), ARRAY_A);
    }

    public function get_setting($key) {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_settings';
        $result = $wpdb->get_var($wpdb->prepare("SELECT setting_value FROM $table WHERE setting_key = %s", $key));
        return $result ? json_decode($result, true) : array();
    }

    public function update_setting($key, $value) {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_settings';
        
        $wpdb->query($wpdb->prepare("
            INSERT INTO $table (setting_key, setting_value) 
            VALUES (%s, %s) 
            ON DUPLICATE KEY UPDATE setting_value = %s
        ", $key, json_encode($value), json_encode($value)));
    }

    public function get_bot_messages() {
        // Возвращаем предзагруженные сообщения ботов
        return array(
            array(
                'id' => 'bot_1',
                'bot_name' => 'AI Assistant',
                'message' => 'Привет всем! Сегодня отличный день для обсуждения новых технологий.',
                'time' => '10:00',
                'avatar_color' => '#6C5CE7'
            )
            // Добавить остальные сообщения из экспорта
        );
    }

    public function get_design_settings() {
        return $this->get_setting('design_settings');
    }

    public function add_admin_menu() {
        add_menu_page(
            'AI Bot Chat',
            'AI Bot Chat',
            'manage_options',
            'ai-bot-chat',
            array($this, 'admin_page'),
            'dashicons-format-chat',
            30
        );
    }

    public function admin_page() {
        include AI_BOT_CHAT_PLUGIN_DIR . 'admin/admin-page.php';
    }

    public function activate() {
        $this->create_tables();
        flush_rewrite_rules();
    }

    public function deactivate() {
        flush_rewrite_rules();
    }
}

// Инициализируем плагин
new AiBotChatSimulator();

// Шорткод для вывода чата
function ai_bot_chat_shortcode($atts) {
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px'
    ), $atts);

    ob_start();
    include AI_BOT_CHAT_PLUGIN_DIR . 'templates/chat.php';
    return ob_get_clean();
}
add_shortcode('ai_bot_chat', 'ai_bot_chat_shortcode');

?>`;

    setGeneratedCode(mainFile);
  };

  // Генерация CSS файла
  const generateCSSFile = (data: ExportData) => {
    return `/* AI Bot Chat Simulator Styles */
.ai-bot-chat-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: ${data.designSettings.fontFamily || 'Inter'}, sans-serif;
    background: linear-gradient(135deg, ${data.designSettings.primaryColor}10, ${data.designSettings.secondaryColor}10);
    border-radius: ${data.designSettings.borderRadius || '8px'};
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.ai-bot-chat-header {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.ai-bot-chat-title {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, ${data.designSettings.primaryColor}, ${data.designSettings.secondaryColor});
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.ai-bot-chat-messages {
    height: 500px;
    overflow-y: auto;
    padding: 1rem;
    background: #ffffff;
}

.ai-bot-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    animation: fadeIn ${data.designSettings.animationSpeed || '300ms'} ease-out;
}

.ai-bot-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.ai-bot-message-content {
    flex: 1;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    padding: 1rem;
    border-radius: ${data.designSettings.borderRadius || '8px'};
    border: 1px solid #e2e8f0;
}

.ai-user-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-direction: row-reverse;
    animation: slideInRight ${data.designSettings.animationSpeed || '300ms'} ease-out;
}

.ai-user-message .ai-bot-avatar {
    background: linear-gradient(135deg, ${data.designSettings.primaryColor}, ${data.designSettings.secondaryColor});
    margin-left: 0.75rem;
    margin-right: 0;
}

.ai-user-message .ai-bot-message-content {
    background: linear-gradient(135deg, ${data.designSettings.primaryColor}, ${data.designSettings.secondaryColor});
    color: white;
}

.ai-bot-chat-input {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
}

.ai-quote-block {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-left: 4px solid ${data.designSettings.primaryColor};
    padding: 0.75rem;
    border-radius: 0 ${data.designSettings.borderRadius || '8px'} ${data.designSettings.borderRadius || '8px'} 0;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all ${data.designSettings.animationSpeed || '300ms'} ease;
}

.ai-quote-block:hover {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
}

.ai-typing-indicator {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    animation: fadeIn ${data.designSettings.animationSpeed || '300ms'} ease-out;
}

.ai-typing-dots {
    display: flex;
    gap: 0.25rem;
}

.ai-typing-dot {
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typingBounce 1.4s infinite ease-in-out both;
}

.ai-typing-dot:nth-child(1) { animation-delay: -0.32s; }
.ai-typing-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes typingBounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

/* Адаптивность */
@media (max-width: 768px) {
    .ai-bot-chat-container {
        margin: 0 1rem;
    }
    
    .ai-bot-chat-messages {
        height: 400px;
    }
    
    .ai-bot-message-content {
        font-size: 0.9rem;
    }
}`;
  };

  // Генерация JavaScript файла
  const generateJSFile = (data: ExportData) => {
    return `/* AI Bot Chat Simulator JavaScript */
(function($) {
    'use strict';

    class AiBotChat {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
            this.startBotMessages();
            this.initUserSession();
        }

        bindEvents() {
            $(document).on('submit', '.ai-chat-form', this.sendMessage.bind(this));
            $(document).on('click', '.ai-reply-btn', this.quoteMessage.bind(this));
            $(document).on('click', '.ai-quote-block', this.scrollToMessage.bind(this));
        }

        sendMessage(e) {
            e.preventDefault();
            
            const form = $(e.target);
            const input = form.find('input[name="message"]');
            const message = input.val().trim();
            
            if (!message) return;

            const userName = this.getUserName();
            if (!userName) {
                this.showNameModal(() => this.sendMessage(e));
                return;
            }

            this.addUserMessage(userName, message);
            input.val('');

            // Отправляем сообщение на сервер
            $.ajax({
                url: aiBotChat.ajax_url,
                type: 'POST',
                data: {
                    action: 'send_message',
                    nonce: aiBotChat.nonce,
                    user_name: userName,
                    message: message
                },
                success: (response) => {
                    if (response.success) {
                        console.log('Сообщение отправлено:', response.data.message_id);
                    }
                }
            });
        }

        addUserMessage(userName, message) {
            const time = new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const messageHtml = \`
                <div class="ai-user-message">
                    <div class="ai-bot-avatar" style="background: linear-gradient(135deg, ${data.designSettings.primaryColor}, ${data.designSettings.secondaryColor})">
                        \${userName.charAt(0).toUpperCase()}
                    </div>
                    <div class="ai-bot-message-content">
                        <div class="ai-message-header">
                            <strong>\${userName}</strong>
                            <span class="ai-message-time">\${time}</span>
                        </div>
                        <p>\${message}</p>
                        <button class="ai-reply-btn" data-author="\${userName}" data-message="\${message}">
                            Ответить
                        </button>
                    </div>
                </div>
            \`;

            $('.ai-bot-chat-messages').append(messageHtml);
            this.scrollToBottom();
        }

        startBotMessages() {
            const messages = aiBotChat.messages || [];
            let index = 0;

            const showNextMessage = () => {
                if (index < messages.length) {
                    this.addBotMessage(messages[index]);
                    index++;
                    setTimeout(showNextMessage, 2000 + Math.random() * 1000);
                }
            };

            showNextMessage();
        }

        addBotMessage(message) {
            const messageHtml = \`
                <div class="ai-bot-message" data-message-id="\${message.id}">
                    <div class="ai-bot-avatar" style="background-color: \${message.avatar_color}">
                        \${message.bot_name.charAt(0)}
                    </div>
                    <div class="ai-bot-message-content">
                        <div class="ai-message-header">
                            <strong>\${message.bot_name}</strong>
                            <span class="ai-bot-badge">Бот</span>
                            <span class="ai-message-time">Сегодня в \${message.time}</span>
                        </div>
                        \${message.reply_to ? this.createQuoteBlock(message.reply_to) : ''}
                        <p>\${message.message}</p>
                        <button class="ai-reply-btn" data-author="\${message.bot_name}" data-message="\${message.message}" data-message-id="\${message.id}">
                            Ответить
                        </button>
                    </div>
                </div>
            \`;

            $('.ai-bot-chat-messages').append(messageHtml);
            this.scrollToBottom();
        }

        createQuoteBlock(quote) {
            return \`
                <div class="ai-quote-block" data-message-id="\${quote.message_id || ''}">
                    <div class="ai-quote-author">\${quote.bot_name || quote.author}</div>
                    <div class="ai-quote-text">\${quote.message_short}</div>
                </div>
            \`;
        }

        quoteMessage(e) {
            const btn = $(e.target);
            const author = btn.data('author');
            const message = btn.data('message');
            const messageId = btn.data('message-id');

            this.showQuoteInput(author, message, messageId);
        }

        showQuoteInput(author, message, messageId) {
            const quoteHtml = \`
                <div class="ai-quote-input">
                    <div class="ai-quote-preview">
                        <span>Ответ на сообщение от \${author}:</span>
                        <p>\${message.length > 100 ? message.substring(0, 100) + '...' : message}</p>
                        <button class="ai-cancel-quote">×</button>
                    </div>
                </div>
            \`;

            $('.ai-chat-form').prepend(quoteHtml);
            
            $(document).on('click', '.ai-cancel-quote', () => {
                $('.ai-quote-input').remove();
            });
        }

        scrollToMessage(e) {
            const messageId = $(e.target).closest('.ai-quote-block').data('message-id');
            const targetMessage = $(\`[data-message-id="\${messageId}"]\`);
            
            if (targetMessage.length) {
                targetMessage[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetMessage.addClass('ai-highlight');
                setTimeout(() => targetMessage.removeClass('ai-highlight'), 2000);
            }
        }

        scrollToBottom() {
            const container = $('.ai-bot-chat-messages');
            container.scrollTop(container[0].scrollHeight);
        }

        getUserName() {
            return localStorage.getItem('ai_chat_user_name') || '';
        }

        showNameModal(callback) {
            const modalHtml = \`
                <div class="ai-modal-overlay">
                    <div class="ai-modal">
                        <h3>Добро пожаловать в чат!</h3>
                        <p>Представьтесь, чтобы другие участники могли обращаться к вам по имени</p>
                        <form class="ai-name-form">
                            <input type="text" name="user_name" placeholder="Введите ваше имя" required>
                            <div class="ai-modal-buttons">
                                <button type="button" class="ai-btn-cancel">Отмена</button>
                                <button type="submit" class="ai-btn-save">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            \`;

            $('body').append(modalHtml);

            $(document).on('submit', '.ai-name-form', (e) => {
                e.preventDefault();
                const name = $(e.target).find('input[name="user_name"]').val().trim();
                if (name) {
                    localStorage.setItem('ai_chat_user_name', name);
                    $('.ai-modal-overlay').remove();
                    if (callback) callback();
                }
            });

            $(document).on('click', '.ai-btn-cancel, .ai-modal-overlay', (e) => {
                if (e.target === e.currentTarget) {
                    $('.ai-modal-overlay').remove();
                }
            });
        }

        initUserSession() {
            // Проверяем новые ответы от ботов для текущего пользователя
            this.pollForBotReplies();
        }

        pollForBotReplies() {
            setInterval(() => {
                $.ajax({
                    url: aiBotChat.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'check_bot_replies',
                        nonce: aiBotChat.nonce,
                        user_session: this.getUserSession()
                    },
                    success: (response) => {
                        if (response.success && response.data.replies) {
                            response.data.replies.forEach(reply => {
                                this.addBotReply(reply);
                            });
                        }
                    }
                });
            }, 5000); // Проверяем каждые 5 секунд
        }

        addBotReply(reply) {
            const replyHtml = \`
                <div class="ai-bot-message ai-bot-reply">
                    <div class="ai-bot-avatar" style="background-color: \${reply.bot_color}">
                        \${reply.bot_name.charAt(0)}
                    </div>
                    <div class="ai-bot-message-content">
                        <div class="ai-quote-block">
                            <div class="ai-quote-author">Вы</div>
                            <div class="ai-quote-text">\${reply.original_message}</div>
                        </div>
                        <div class="ai-message-header">
                            <strong>\${reply.bot_name}</strong>
                            <span class="ai-bot-badge">Бот</span>
                            <span class="ai-message-time">\${reply.time}</span>
                        </div>
                        <p>\${reply.message}</p>
                    </div>
                </div>
            \`;

            $('.ai-bot-chat-messages').append(replyHtml);
            this.scrollToBottom();
        }

        getUserSession() {
            let session = localStorage.getItem('ai_chat_session');
            if (!session) {
                session = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('ai_chat_session', session);
            }
            return session;
        }
    }

    // Инициализируем чат когда DOM готов
    $(document).ready(() => {
        if ($('.ai-bot-chat-container').length) {
            new AiBotChat();
        }
    });

})(jQuery);`;
  };

  // Генерация шаблона чата
  const generateChatTemplate = () => {
    return `<?php
/**
 * Шаблон чата для AI Bot Chat Simulator
 */

// Предотвращаем прямой доступ
if (!defined('ABSPATH')) {
    exit;
}

$design = ai_bot_chat_get_design_settings();
$bots = ai_bot_chat_get_active_bots();
?>

<div class="ai-bot-chat-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
    <div class="ai-bot-chat-header">
        <h2 class="ai-bot-chat-title">AI Bot Chat Simulator</h2>
        <p class="ai-bot-chat-subtitle">Живое общение ботов</p>
        <div class="ai-online-indicator">
            <span class="ai-status-dot"></span>
            <span>Онлайн</span>
        </div>
    </div>

    <div class="ai-bot-chat-messages">
        <!-- Сообщения будут добавляться через JavaScript -->
    </div>

    <div class="ai-bot-chat-input">
        <form class="ai-chat-form">
            <div class="ai-input-group">
                <input type="text" name="message" placeholder="Введите ваше сообщение..." autocomplete="off">
                <button type="submit" class="ai-send-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                    Отправить
                </button>
            </div>
        </form>
    </div>
</div>

<style>
:root {
    --ai-primary-color: <?php echo esc_attr($design['primary_color'] ?? '#6C5CE7'); ?>;
    --ai-secondary-color: <?php echo esc_attr($design['secondary_color'] ?? '#74B9FF'); ?>;
    --ai-accent-color: <?php echo esc_attr($design['accent_color'] ?? '#00B894'); ?>;
    --ai-background-color: <?php echo esc_attr($design['background_color'] ?? '#F8F9FA'); ?>;
    --ai-border-radius: <?php echo esc_attr($design['border_radius'] ?? '8px'); ?>;
    --ai-animation-speed: <?php echo esc_attr($design['animation_speed'] ?? '300ms'); ?>;
}
</style>`;
  };

  // Генерация админской страницы
  const generateAdminPage = () => {
    return `<?php
/**
 * Административная страница плагина
 */

// Предотвращаем прямой доступ
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1>AI Bot Chat Simulator</h1>
    
    <div class="ai-admin-tabs">
        <nav class="nav-tab-wrapper">
            <a href="#bots" class="nav-tab nav-tab-active">Боты</a>
            <a href="#messages" class="nav-tab">Сообщения</a>
            <a href="#telegram" class="nav-tab">Telegram</a>
            <a href="#design" class="nav-tab">Дизайн</a>
            <a href="#export" class="nav-tab">Экспорт</a>
        </nav>

        <div id="bots" class="ai-tab-content">
            <h2>Управление ботами</h2>
            <p>Создавайте и настраивайте ботов для участия в чате</p>
            
            <div class="ai-bots-grid">
                <!-- Список ботов будет загружаться через AJAX -->
            </div>
            
            <button class="button button-primary ai-add-bot">Добавить бота</button>
        </div>

        <div id="messages" class="ai-tab-content" style="display: none;">
            <h2>Входящие сообщения</h2>
            <p>Сообщения от пользователей, требующие ответа</p>
            
            <div class="ai-messages-list">
                <!-- Список сообщений -->
            </div>
        </div>

        <div id="telegram" class="ai-tab-content" style="display: none;">
            <h2>Настройки Telegram</h2>
            <form method="post" action="options.php">
                <?php settings_fields('ai_bot_chat_telegram'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Bot Token</th>
                        <td>
                            <input type="password" name="ai_bot_chat_telegram[bot_token]" value="<?php echo esc_attr(get_option('ai_bot_chat_telegram')['bot_token'] ?? ''); ?>" class="regular-text">
                            <p class="description">Получите токен от @BotFather в Telegram</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Chat ID</th>
                        <td>
                            <input type="text" name="ai_bot_chat_telegram[chat_id]" value="<?php echo esc_attr(get_option('ai_bot_chat_telegram')['chat_id'] ?? ''); ?>" class="regular-text">
                            <p class="description">ID чата для получения уведомлений</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Сохранить настройки'); ?>
            </form>
        </div>

        <div id="design" class="ai-tab-content" style="display: none;">
            <h2>Настройки дизайна</h2>
            <form method="post" action="options.php">
                <?php settings_fields('ai_bot_chat_design'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Основной цвет</th>
                        <td>
                            <input type="color" name="ai_bot_chat_design[primary_color]" value="<?php echo esc_attr(get_option('ai_bot_chat_design')['primary_color'] ?? '#6C5CE7'); ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Вторичный цвет</th>
                        <td>
                            <input type="color" name="ai_bot_chat_design[secondary_color]" value="<?php echo esc_attr(get_option('ai_bot_chat_design')['secondary_color'] ?? '#74B9FF'); ?>">
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Сохранить дизайн'); ?>
            </form>
        </div>

        <div id="export" class="ai-tab-content" style="display: none;">
            <h2>Экспорт настроек</h2>
            <p>Скачайте готовый плагин WordPress с вашими настройками</p>
            
            <div class="ai-export-options">
                <button class="button button-primary ai-export-plugin">Скачать плагин</button>
                <button class="button ai-export-settings">Экспорт настроек JSON</button>
                <button class="button ai-import-settings">Импорт настроек</button>
            </div>
        </div>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Переключение табов
    $('.nav-tab').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href').substring(1);
        
        $('.nav-tab').removeClass('nav-tab-active');
        $(this).addClass('nav-tab-active');
        
        $('.ai-tab-content').hide();
        $('#' + target).show();
    });
});
</script>

<style>
.ai-admin-tabs {
    margin-top: 20px;
}

.ai-tab-content {
    background: #fff;
    padding: 20px;
    border: 1px solid #ccd0d4;
    border-top: none;
}

.ai-bots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.ai-bot-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background: #f9f9f9;
}

.ai-export-options {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.ai-export-options .button {
    padding: 10px 20px;
    height: auto;
}
</style>`;
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
            <Button onClick={loadExportData} className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="FileCode" size={16} className="mr-2" />
              Сгенерировать плагин
            </Button>
            {generatedCode && (
              <Button onClick={downloadAllFiles} variant="outline">
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

          {generatedCode && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
          )}

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
        </div>
      </CardContent>
    </Card>
  );
};

export default WordPressExporter;