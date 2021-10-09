import { SlashCommandBuilder } from "@discordjs/builders";

const commands: SlashCommandBuilder[] = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a list of commands this bot is able to do."),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Queue up a song for the bot to play.")
    .addStringOption((option) =>
      option.setName("input").setDescription("Music title").setRequired(true)
    ),
];

export const deployableCommands = commands.map((command) => command.toJSON());
