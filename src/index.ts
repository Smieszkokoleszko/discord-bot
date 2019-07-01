import { DiscordBot } from './DiscordBot';
import { IConfig } from './IConfig';

const config: IConfig = {
    default_status: process.env.DEFAULT_STATUS,
    discord_token: process.env.TOKEN,
    logs_channel: process.env.LOGS_CHANNEL,
    messages_prefix: process.env.PREFIX,
    watch_channel: process.env.WATCH_CHANNEL,
};

console.log({ ...config, discord_token: config.discord_token.substr(0, 5) });

const bot = new DiscordBot(config);
bot.start();
