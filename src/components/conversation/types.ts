export interface ConversationMessage {
  id: string;
  bot_name: string;
  message: string;
  time: string;
  reply_to?: {
    bot_name: string;
    message_short: string;
    message_id: string;
  };
  avatar_color: string;
  delay_seconds: number;
}

export interface Bot {
  id: string;
  name: string;
  displayName: string;
  avatar_color: string;
  personality: string;
  isActive: boolean;
}