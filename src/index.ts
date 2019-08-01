import { DiscordBot } from './DiscordBot';
import { IConfig } from './IConfig';
import * as dotenv from 'dotenv';

let result = dotenv.config({ path: `${__dirname}/../.env` });

const config: IConfig = {
    default_status: process.env.DEFAULT_STATUS,
    discord_token: process.env.TOKEN,
    logs_channel: process.env.LOGS_CHANNEL,
    messages_prefix: process.env.PREFIX,
    watch_channel: process.env.WATCH_CHANNEL,
    watch_category_id: process.env.WATCH_CATEGORY_ID,
};

console.log({ ...config, discord_token: config.discord_token.substr(0, 5) });

const bot = new DiscordBot(config);
bot.start();
