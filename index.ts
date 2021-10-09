// Require the necessary discord.js classes
import { Client, Intents, Interaction, Message } from "discord.js";
import { Commands } from "./types";
import { ConfigConstants } from "./config/config";
import { Player } from "discord-player";
import { MusicPlayer } from "./services/music/MusicPlayer";
import { parseSearchString } from "./utils/parseSearchString";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

interface Queue {
  metadata: {
    channel: {
      send: (msg: string) => any;
    };
  };
}

const { prefix } = ConfigConstants;

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

const handlePlayCommand = async (message: Message, url) => {
  if (!musicPlayer) {
    musicPlayer = new MusicPlayer({ client, message });
  }

  const args = message.content
    .slice(ConfigConstants.prefix.length)
    .trim()
    .split(/ +/g);

  console.log(args);
  await musicPlayer.playSong(args.slice(1));
};

client.on("messageCreate", async (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case Commands.PLAY:
        await handlePlayCommand(message, parseSearchString(args));
        break;
      case Commands.CURRENT:
        await musicPlayer.getCurrentTrack();
      case Commands.SKIP:
        await musicPlayer.skipCurrentTrack();
    }
  } catch (error) {
    console.error(error);
    message.channel.send(
      "Unknown command. Please use /help to get list of commands"
    );
  }
});
// Login to Discord with your client's token
client.login(ConfigConstants.token);
