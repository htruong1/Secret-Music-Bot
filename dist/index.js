"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require the necessary discord.js classes
const discord_js_1 = require("discord.js");
const types_1 = require("./types");
const config_1 = require("./config/config");
const MusicPlayer_1 = require("./services/music/MusicPlayer");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
const { prefix } = config_1.ConfigConstants;
client.once("ready", () => {
    console.log("Ready!");
});
let musicPlayer = null;
// client.on("interactionCreate", async (interaction: Interaction) => {
//   if (!interaction.isCommand()) return;
//   const { commandName } = interaction;
//   try {
//     switch (commandName) {
//       case Commands.HELP:
//         await interaction.reply("Currently wip :D");
//         break;
//       case Commands.PLAY:
//         const x = interaction.options.get("input");
//         // console.log(interaction.options.get("input"), "###");
//         await interaction.reply("Jared is too busy kissing his roomates");
//         break;
//       default:
//         await interaction.reply("Unknown Command. Big OOF");
//         break;
//     }
//   } catch (error) {
//     await interaction.reply(
//       "An unknown command was given. Please type /help for list of commands."
//     );
//     return;
//   }
// });
const handlePlayCommand = (message, url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!musicPlayer) {
        musicPlayer = new MusicPlayer_1.MusicPlayer({ client, message });
    }
    const args = message.content
        .slice(config_1.ConfigConstants.prefix.length)
        .trim()
        .split(/ +/g);
    console.log(musicPlayer, "###");
    yield musicPlayer.playSong(args[1]);
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    try {
        switch (command) {
            case types_1.Commands.PLAY:
                yield handlePlayCommand(message, args[0]);
                break;
            case types_1.Commands.CURRENT:
                yield musicPlayer.getCurrentTrack();
            case types_1.Commands.SKIP:
                yield musicPlayer.skipCurrentTrack();
        }
    }
    catch (error) {
        console.error(error);
        message.channel.send("Unknown command. Please use /help to get list of commands");
    }
}));
// Login to Discord with your client's token
client.login(config_1.ConfigConstants.token);
//# sourceMappingURL=index.js.map