import { Client, RichEmbed, Message, MessageReaction, ChannelData, TextChannel, Emoji, ReactionEmoji } from 'discord.js';
import { IConfig } from './IConfig';

export class DiscordBot {
    private client: Client;
    private config: IConfig;

    constructor(config: IConfig) {
        this.client = new Client();
        this.config = config;
    }

    public start() {
        const client = this.client;
        this.handleRawMessages();

        // Ready handler
        client.on('ready', () => {
            // tslint:disable-next-line: max-line-length
            console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

            client.user.setActivity(this.config.default_status);
        });

        // Messages handler
        client.on('message', async (message) => {
            if (message.author.bot) return;
            if (message.content.indexOf(this.config.messages_prefix) !== 0) return;

            const args = message.content.slice(this.config.messages_prefix.length)
                .trim()
                .split(/ +/g)
            ;
            const command = args.shift().toLowerCase();

            // Let's go with a few common example commands! Feel free to delete or change those.

            if (command === 'ping') {
                const m = await message.channel.send('Ping?') as Message;
                // tslint:disable-next-line: max-line-length
                m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            }
        });

        this.handleReactionAdd();
        this.handleReactionRemoved();

        client.login(this.config.discord_token);
    }

    protected handleReactionAdd() {
        this.client.on('messageReactionAdd', async (reaction, user) => {
            const message = reaction.message;
            const channel = message.channel;
            if (!(channel instanceof TextChannel)) return;
            if (user.bot) return;
            if (channel.name !== this.config.watch_channel && channel.parentID !== this.config.watch_category_id) return;

            console.log('new #zapisy reaction', {
                text: message.content,
                user: user.username,
                discriminator: user.discriminator,
            });

            let emojiUrl = '';
            if (reaction.emoji instanceof Emoji) {
                emojiUrl = reaction.emoji.url;
            }

            const embed = new RichEmbed()
                .setColor('GREEN')
                .setAuthor(`${user.tag}`, user.avatarURL)
                .setThumbnail(emojiUrl)
                // tslint:disable-next-line: prefer-template
                .setDescription('**Reason:** A reaction was added\n'
                    + `**Message:** \`${message.content.substr(0, 60)}\`\n`
                    + `**Emoji:** ${reaction.emoji.name} (${reaction.emoji.id})\n`
                    + `**Message Link:** https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${reaction.message.id}`)
                .setTimestamp();

            const logChannel = reaction.message.guild.channels.find(chan => chan.name === this.config.logs_channel);
            if (!logChannel) {
                console.warn('Could not find logs channel!');
                return;
            }
            if (!((logChannel): logChannel is TextChannel => logChannel.type === 'text')(logChannel)) {
                console.warn('Given logs channel has incorrect type!');
                return;
            }

            logChannel.send({ embed });
        });
    }

    protected handleReactionRemoved() {
        this.client.on('messageReactionRemove', async (reaction, user) => {
            const message = reaction.message;
            const channel = message.channel;
            if (!(channel instanceof TextChannel)) return;
            if (channel.name !== this.config.watch_channel || user.bot) return;
            if (channel.id === '600089051445461012') return;

            console.log('removed #zapisy reaction', {
                text: message.content,
                user: user.username,
                discriminator: user.discriminator,
            });

            let emojiUrl = '';
            if (reaction.emoji instanceof Emoji) {
                emojiUrl = reaction.emoji.url;
            }

            const embed = new RichEmbed()
                .setColor('RED')
                .setAuthor(`${user.tag}`, user.avatarURL)
                .setThumbnail(emojiUrl)
                // tslint:disable-next-line: prefer-template
                .setDescription('**Reason:** A reaction was removed\n'
                    + `**Message:** \`${message.content.substr(0, 60)}\`\n`
                    + `**Emoji:** ${reaction.emoji.name} (${reaction.emoji.id})\n`
                    + `**Message Link:** https://discordapp.com/channels/${channel.guild.id}/${channel.id}/${reaction.message.id}`)
                .setTimestamp();

            const logChannel = reaction.message.guild.channels.find(chan => chan.name === this.config.logs_channel);
            if (!logChannel) {
                console.warn('Could not find logs channel!');
                return;
            }
            if (!((logChannel): logChannel is TextChannel => logChannel.type === 'text')(logChannel)) {
                console.warn('Given logs channel has incorrect type!');
                return;
            }

            logChannel.send({ embed });
        });
    }

    /**
     * Ensures that reaction evetns will fire even for messages created before bot was running
     */
    protected handleRawMessages() {
        const client = this.client;
        client.on('raw', async (packet: any) => {
            // We don't want this to run on unrelated packets
            const supportedMessages: string[] = ['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'];
            if (!supportedMessages.some(x => x === packet.t)) return;
            // Grab the channel to check the message from
            const channel = this.client.channels.get(packet.d.channel_id);
            if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;
            // There's no need to emit if the message is cached,
            // because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id)) return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then((message) => {
                const client = this.client as any;
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                const reaction = message.reactions.get(emoji);
                // Adds the currently reacting user to the reaction's users collection.
                if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        });
    }
}
