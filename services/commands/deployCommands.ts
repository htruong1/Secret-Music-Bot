import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
// import { deployableCommands } from "./commands";
import { SlashCommandBuilder } from "@discordjs/builders";

import { ConfigConstants } from "../../config/config";
const commands: SlashCommandBuilder[] = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a list of commands this bot is able to do."),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Queue up a song for the bot to play."),
];

const deployableCommands = commands.map((command) => command.toJSON());
const rest = new REST({ version: "9" }).setToken(ConfigConstants.token);
console.log(ConfigConstants);
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        ConfigConstants.clientId,
        ConfigConstants.guildId
      ),
      {
        body: deployableCommands,
      }
    );

    console.log("Successfully registered donut bot commands.");
  } catch (error) {
    console.error("oof", error);
  }
})();
