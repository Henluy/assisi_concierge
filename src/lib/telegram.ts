
import { Telegraf, Context } from 'telegraf';
import { Message } from 'telegraf/types';

// Initialize bot for webhook mode
const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN is not defined');
}

export const bot = botToken ? new Telegraf(botToken) : null;

export const sendTelegramMessage = async (chatId: number, text: string) => {
    if (!bot) return;
    try {
        await bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
};

export const getTelegramFileUrl = async (fileId: string): Promise<string | null> => {
    if (!bot) return null;
    try {
        const fileLink = await bot.telegram.getFileLink(fileId);
        return fileLink.href;
    } catch (error) {
        console.error('Error getting Telegram file URL:', error);
        return null;
    }
};
