const { Client, GatewayIntentBits } = require('discord.js');
const DeepL = require('deepl-node');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// DeepL クライアント
const deepl = new DeepL.Translator(process.env.DEEPL_API_KEY);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    if (!msg.content.startsWith('!tr ')) return;

    const text = msg.content.replace('!tr ', '');

    try {
        const result = await deepl.translateText(text, null, 'EN-US');
        msg.reply(result.text);
    } catch (err) {
        console.error(err);
        msg.reply('翻訳中にエラーが起きました');
    }
});

client.login(process.env.DISCORD_TOKEN);