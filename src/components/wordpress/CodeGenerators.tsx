interface ExportData {
  bots: any[];
  telegramSettings: any;
  designSettings: any;
  chatMessages: any[];
}

// Генерация основного файла плагина
export const generateWordPressPlugin = (data: ExportData) => {
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

    // Остальные методы остаются без изменений...
    
    public function get_bots() {
        global $wpdb;
        $table = $wpdb->prefix . 'ai_chat_bots';
        return $wpdb->get_results("SELECT * FROM $table WHERE is_active = 1", ARRAY_A);
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

  return mainFile;
};

// Генерация CSS файла
export const generateCSSFile = (data: ExportData) => {
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
export const generateJSFile = (data: ExportData) => {
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

        scrollToBottom() {
            const container = $('.ai-bot-chat-messages');
            container.scrollTop(container[0].scrollHeight);
        }

        getUserName() {
            return localStorage.getItem('ai_chat_user_name') || '';
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
export const generateChatTemplate = () => {
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
export const generateAdminPage = () => {
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
</script>`;
};