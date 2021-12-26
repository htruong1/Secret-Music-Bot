import { Client, Interaction, Message } from "discord.js";

import { Player, SearchOptions, QueryType } from "discord-player";

interface IMusicPlayer {
  playSong: (songQueryParams: string[]) => Promise<void>;
}

export class MusicPlayer implements IMusicPlayer {
  private interaction: Interaction;
  private message: Message;
  private player: Player;
  private playerQueue;

  constructor({
    client,
    message,
    interaction,
  }: {
    client: Client;
    message?: Message;
    interaction?: Interaction;
  }) {
    this.message = message ?? null;
    this.interaction = interaction ?? null;
    this.player = new Player(client);
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

  public async playSong(songQueryParams: string[]) {
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
        await this.playerQueue.connect(voiceChannel);
      }
      const { songQuery, requestedBy, searchEngine } =
        this.buildSongQuery(songQueryParams);
      const track = await this.getAudioTrack(songQuery, {
        requestedBy,
        searchEngine,
      });

      if (!this.playerQueue.track) {
        this.playerQueue.play(track);
      } else {
        this.playerQueue.addTrack(track);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCurrentTrack() {
    this.message.channel.send(
      `Currently playing: ${this.playerQueue.current.title}`
    );
  }

  public async skipCurrentTrack() {
    await this.playerQueue.skip();
  }
  private buildSongQuery(songQueryParams: string[]) {
    if (songQueryParams.length > 0) {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.YOUTUBE_SEARCH,
        songQuery: songQueryParams.join(" "),
      };
    }
    if (songQueryParams[0].includes("youtube.com")) {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.YOUTUBE_VIDEO,
        songQuery: songQueryParams[0],
      };
    } else if (songQueryParams[0].includes("open.spotify.com/track")) {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.SPOTIFY_SONG,
        songQuery: songQueryParams[0],
      };
    } else if (songQueryParams[0].includes("open.spotify.com/playlist")) {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.SPOTIFY_PLAYLIST,
        songQuery: songQueryParams[0],
      };
    } else if (songQueryParams[0].includes("open.spotify.com/album")) {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.SPOTIFY_PLAYLIST,
        songQuery: songQueryParams[0],
      };
    } else {
      return {
        requestedBy: this.message.author,
        searchEngine: QueryType.YOUTUBE_SEARCH,
        songQuery: songQueryParams.join(" "),
      };
    }
  }
  private async getAudioTrack(
    songQuery: string,
    searchOptions: { requestedBy; searchEngine }
  ) {
    return this.player
      .search(songQuery, searchOptions)
      .then((searchResults) => searchResults.tracks[0]);
  }

  private initListenerEvents() {
    this.player.on("trackStart", (queue: any, track) => {
      /* tslint:disable-next-line */
      queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
    });
    this.player.on("trackAdd", (queue: any, track) => {
      /* tslint:disable-next-line */
      queue.metadata.channel.send(
        `🎶 | Added **${track.title}** to the music queue!`
      );
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
