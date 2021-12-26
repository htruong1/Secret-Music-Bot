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
            ytdlOptions: {
                quality: "highest",
                filter: "audioonly",
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
            },
        });
        this.initListenerEvents();
    }
    playSong(songQueryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = this.message.member.voice.channel;
            try {
                if (this.playerQueue.destroyed) {
                    this.playerQueue = this.player.createQueue(this.message.guild, {
                        metadata: {
                            channel: this.message.channel,
                        },
                        ytdlOptions: {
                            quality: "highest",
                            filter: "audioonly",
                            highWaterMark: 1 << 25,
                            dlChunkSize: 0,
                        },
                    });
                }
                if (!this.playerQueue.connection) {
                    console.log("connecting");
                    yield this.playerQueue.connect(voiceChannel);
                }
                const { songQuery, requestedBy, searchEngine } = this.buildSongQuery(songQueryParams);
                const track = yield this.getAudioTrack(songQuery, {
                    requestedBy,
                    searchEngine,
                });
                if (!this.playerQueue.track) {
                    this.playerQueue.play(track);
                }
                else {
                    this.playerQueue.addTrack(track);
                }
            }
            catch (error) {
                console.log(error);
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
    buildSongQuery(songQueryParams) {
        if (songQueryParams.length > 0) {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.YOUTUBE_SEARCH,
                songQuery: songQueryParams.join(" "),
            };
        }
        if (songQueryParams[0].includes("youtube.com")) {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO,
                songQuery: songQueryParams[0],
            };
        }
        else if (songQueryParams[0].includes("open.spotify.com/track")) {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.SPOTIFY_SONG,
                songQuery: songQueryParams[0],
            };
        }
        else if (songQueryParams[0].includes("open.spotify.com/playlist")) {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.SPOTIFY_PLAYLIST,
                songQuery: songQueryParams[0],
            };
        }
        else if (songQueryParams[0].includes("open.spotify.com/album")) {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.SPOTIFY_PLAYLIST,
                songQuery: songQueryParams[0],
            };
        }
        else {
            return {
                requestedBy: this.message.author,
                searchEngine: discord_player_1.QueryType.YOUTUBE_SEARCH,
                songQuery: songQueryParams.join(" "),
            };
        }
    }
    getAudioTrack(songQuery, searchOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.player
                .search(songQuery, searchOptions)
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
        this.player.on("error", (queue, error) => {
            /* tslint:disable-next-line */
            console.log("###An Error has occured", error);
        });
        this.player.on("queueEnd", () => {
            this.playerQueue.destroy(true);
            console.log("player has been destroyed");
        });
        this.player.on("botDisconnect", () => {
            console.log("Disconnected");
            this.playerQueue.destroy();
            this.playerQueue.connection = null;
        });
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map