"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployableCommands = void 0;
const builders_1 = require("@discordjs/builders");
const commands = [
    new builders_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of commands this bot is able to do."),
    new builders_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Queue up a song for the bot to play.")
        .addStringOption((option) => option.setName("input").setDescription("Music title").setRequired(true)),
];
exports.deployableCommands = commands.map((command) => command.toJSON());
//# sourceMappingURL=commands.js.map