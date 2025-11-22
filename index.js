require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { 
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus 
} = require("@discordjs/voice");
const play = require("play-dl");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!play")) return;

    const args = message.content.split(" ");
    const url = args[1];

    if (!url) {
        return message.reply("YouTubeのURLを指定してね！");
    }

    if (!message.member.voice.channel) {
        return message.reply("先にボイスチャンネルに入ってね！");
    }

    const vc = message.member.voice.channel;

    // VCへ接続
    const connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator,
    });

    // YouTube音源取得
    const stream = await play.stream(url);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
        message.channel.send("再生が終了しました！");
    });

    message.reply("? 再生を開始したよ！");
});

client.login(process.env.DISCORD_TOKEN);
