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
exports.MusicPlayer = void 0;
const discord_player_1 = require("discord-player");
class MusicPlayer {
    constructor({ client, message, interaction, }) {
        this.message = message !== null && message !== void 0 ? message : null;
        this.interaction = interaction !== null && interaction !== void 0 ? interaction : null;
        this.player = new discord_player_1.Player(client);
        this.playerQueue = this.player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });
        this.initListenerEvents();
    }
    playSong(songQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = this.message.member.voice.channel;
            if (!this.playerQueue.connection) {
                yield this.playerQueue.connect(voiceChannel);
            }
            const track = yield this.getAudioTrack(songQuery);
            if (!this.playerQueue.track) {
                this.playerQueue.play(track);
            }
            else {
                this.playerQueue.addTrack(track);
            }
        });
    }
    getCurrentTrack() {
        return __awaiter(this, void 0, void 0, function* () {
            this.message.channel.send(`Currently playing: ${this.playerQueue.current.title}`);
        });
    }
    skipCurrentTrack() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.playerQueue.skip();
        });
    }
    getAudioTrack(songQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.player
                .search(songQuery, {
                requestedBy: this.message.author,
            })
                .then((searchResults) => searchResults.tracks[0]);
        });
    }
    initListenerEvents() {
        this.player.on("trackStart", (queue, track) => {
            /* tslint:disable-next-line */
            queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
        });
        this.player.on("trackAdd", (queue, track) => {
            /* tslint:disable-next-line */
            queue.metadata.channel.send(`🎶 | Added **${track.title}** to the music queue!`);
        });
        this.player.on("error", (error) => {
            /* tslint:disable-next-line */
            console.log(error);
        });
        this.player.on("queueEnd", () => {
            this.playerQueue.destroy(true);
        });
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map