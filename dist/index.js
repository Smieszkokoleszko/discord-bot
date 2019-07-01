"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordBot_1 = require("./DiscordBot");
const conifg = {
    default_status: process.env.DEFAULT_STATUS,
    discord_token: process.env.TOKEN,
    logs_channel: process.env.LOGS_CHANNEL,
    messages_prefix: process.env.PREFIX,
    watch_channel: process.env.WATCH_CHANNEL,
};
const config = Object.assign(conifg);
const bot = new DiscordBot_1.DiscordBot(config);
bot.start();
//# sourceMappingURL=index.js.map