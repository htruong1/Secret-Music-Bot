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
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
// import { deployableCommands } from "./commands";
const builders_1 = require("@discordjs/builders");
const config_1 = require("../../config/config");
const commands = [
    new builders_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of commands this bot is able to do."),
    new builders_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Queue up a song for the bot to play."),
];
const deployableCommands = commands.map((command) => command.toJSON());
const rest = new rest_1.REST({ version: "9" }).setToken(config_1.ConfigConstants.token);
console.log(config_1.ConfigConstants);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rest.put(v9_1.Routes.applicationGuildCommands(config_1.ConfigConstants.clientId, config_1.ConfigConstants.guildId), {
            body: deployableCommands,
        });
        console.log("Successfully registered donut bot commands.");
    }
    catch (error) {
        console.error("oof", error);
    }
}))();
//# sourceMappingURL=deployCommands.js.map