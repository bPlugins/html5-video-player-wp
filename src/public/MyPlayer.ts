
import { produce } from "immer";
import { EventEmitter } from "bp-utils";
import { Features, QualityItem, CaptionItem, PlayerConstructorOptions, DeferredEvent, SourceInfo, TrackInfo } from "src/interfaces/MyPlayerInterface";


// ────────────────────────────────────────────────────────────────
// MyPlayer Class
// ────────────────────────────────────────────────────────────────

class MyPlayer extends EventEmitter {
  media: HTMLVideoElement;
  poster: string;
  initialized: boolean;
  streamLoaded: boolean;

  isBackend: boolean;
  features: Features;
  container: HTMLElement | null;
  iconUrl: string;
  onEvents: DeferredEvent[];
  provider: string;
  options: any;
  local: any;
  videoId: number;
  player: any;
  disabled: boolean;
  nonce: string;
  captions: CaptionItem[];
  qualities?: QualityItem[];
  touchClientX: number;
  touchClientY: number;
  skin: string;
  uniqueId: string;
  source: string;

  constructor(media: HTMLVideoElement, attributes: any, config: PlayerConstructorOptions) {
    super();

    const { isBackend, qualities, provider } = config;


    // Core state
    this.media = media;
    this.poster = "";
    this.initialized = false;
    this.streamLoaded = false;

    this.isBackend = isBackend;
    this.features = attributes.features;
    this.provider = provider;
    this.videoId = attributes.video_id;
    this.disabled = false;
    this.captions = attributes.subtitle;
    this.qualities = qualities;
    this.nonce = window.h5vpAdmin?.nonce || "";
    this.touchClientX = 0;
    this.touchClientY = 0;
    this.skin = 'default'
    this.uniqueId = attributes.uniqueId;
    this.source = attributes.source;

    // DOM references
    this.container = this.media.closest(".wp-block-html5-player-video") as HTMLElement;
    this.iconUrl = window.h5vpBlock?.plugin_url ? `${window.h5vpBlock.plugin_url}img/plyr.svg` : "";
    this.onEvents = [];
    this.local = window.h5vpBlock || {};

    // Build normalized options
    this.options = this.buildOptions(attributes.options);

    // Validate Plyr is available
    if (typeof window.Plyr === "undefined") {
      console.warn("Plyr is not defined. Please make sure Plyr library is loaded.");
      this.media.setAttribute("controls", "true");
    }

    // Defer player creation (fixes Vimeo race condition)
    // setTimeout(() => this.createPlayer(), 500);
    this.createPlayer()
  }

  // ──────────────────────────────────────────────────────────────
  // Options Building
  // ──────────────────────────────────────────────────────────────

  /**
   * Consolidates all option normalization into a single pass.
   * Replaces the original 5 separate `produce()` calls.
   */
  private buildOptions(raw: any): any {
    const wrapperWidth = (this.media.closest(".plyr_wrapper") as HTMLElement)?.offsetWidth ?? Infinity;

    return produce(raw, (draft: any) => {
      // Markers
      if (draft.markers) {
        draft.markers.enabled = true;
      }

      // Speed options
      if (raw.speed?.options?.[0]) {
        draft.speed.options = raw.speed.options.map((v: any) => parseFloat(v));
      } else {
        draft.speed = { options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] };
      }

      // Fullscreen
      draft.fullscreen = { container: ".plyr_wrapper", iosNative: true };

      // Autoplay — disabled when playWhenVisible is on, or on frontend
      draft.autoplay = this.isBackend ? false : raw.autoplay;

      // Aspect ratio
      draft.ratio = raw.ratio?.includes(":") ? raw.ratio : null;
      // if (!raw.ratio?.includes(":")) {
      //   draft.ratio = "16:9";
      // }

      // Icon URL
      if (this.iconUrl) {
        draft.iconUrl = this.iconUrl;
      }

      // Download URL
      if (!raw.urls?.enabled) {
        draft.urls = { download: null };
      }

      // Strip controls on narrow containers
      if (wrapperWidth <= 425) {
        draft.controls = (raw.controls || []).filter(
          (c: string) => !["fast-forward", "restart", "rewind"].includes(c)
        );
      }

      // Volume / mute / storage
      if (raw.muted) {
        draft.volume = 0;
        draft.storage = { enabled: false };
      } else {
        draft.volume = 0.5;
        draft.storage = { enabled: true };
      }

    });
  }

  /**
   * Instantiates the Plyr player based on source type and wires initial events.
   */
  private createPlayer(): void {
    // const ext = this.getFileExtension(this.source);
    const plyrOpts = { ...this.options, i18n: window.h5vpI18n || {} };

    this.player = new window.Plyr(this.media, { ...plyrOpts, playsinline: true });
    this.player.on("ready", () => this.onReady());
    this.player.on("loadedmetadata", () => {
      if (!this.initialized) {
        this.init();
      }
    });

    this.wireGlobalEvents();
  }

  /**
   * Attaches global events that apply regardless of source type:
   * disable-pause, instance tracking, progress bar fix, mute toggle, poster, source updates.
   */
  private wireGlobalEvents(): void {

    // Global instance tracking
    if (!window.instance) {
      window.instance = [];
    }
    window.instance.push(this.player);

    // Progress bar fallback — update manually if Plyr doesn't
    this.player?.on("play", () => {
      setTimeout(() => {
        const seekInput = this.player?.elements?.inputs?.seek;
        if (seekInput && seekInput.value <= 0) {
          this.player.on("timeupdate", () => {
            const pct = (100 / this.player.duration) * this.player.currentTime;
            if (seekInput) {
              seekInput.setAttribute("style", `--value:${pct}%`);
              seekInput.value = pct;
            }
          });
        }
      }, 3000);

      // Pause in admin context
      if (this.isBackend) {
        this.player.pause();
      }
    });

    // Unmute toggle — bump volume to 40% when unmuting from zero
    this.player?.elements?.buttons?.mute?.addEventListener("click", () => {
      if (this.player.volume === 0) {
        this.player.volume = 0.4;
      }
    });

    // Source update event
    this.addEventListener("update-source", ({ data }: { data: { source: string; qualities: string[]; captions: any } }) => {
      this.setSource(data.source, data.qualities, data.captions);
    });

    // Re-apply poster after ready
    this.player?.on("ready", () => {
      setTimeout(() => {
        if (this.poster && this.player.elements?.poster) {
          this.player.elements.poster.style.cssText = `background-image:url(${this.poster});`;
        }
      }, 500);
    });
  }

  /**
   * Fires when the Plyr player emits "ready".
   */
  onReady(): void {
    // Remove the temporary aspect-ratio from the block container
    const blockContainer = this.player?.elements?.wrapper?.closest(".wp-block-html5-player-video");
    if (blockContainer) {
      blockContainer.style.aspectRatio = "";
    }


    // Flush deferred event listeners
    if (this.onEvents.length > 0) {
      this.onEvents.forEach(({ eventName, callback }) => {
        this.player.on(eventName, callback);
      });
      this.onEvents = [];
    }


    // Space-key play/pause (Plyr default doesn't always work)
    this.player?.elements?.container?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        this.player.playing ? this.player.pause() : this.player.play();
      }
    });

    // Premium client: global space-key toggle
    if (window.location.host.includes("dvrg")) {
      window.document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === " ") {
          this.player.playing ? this.player.pause() : this.player.play();
        }
      });
    }




  }

  // ──────────────────────────────────────────────────────────────
  // Init & Source Management
  // ──────────────────────────────────────────────────────────────

  /**
   * Full initialization: sets sources, tracks, and activates all features.
   */
  init(): void {
    if (!this.player) {
      console.warn("MyPlayer: player not available during init.");
      return;
    }
    this.initialized = true;

    // Build sources & tracks
    const sources = this.buildSources(this.qualities || [], this.source);
    const tracks = this.buildTracks(this.captions);


    this.player.source = {
      type: "video",
      sources,
      poster: this.player.poster && this.player.poster !== "false" ? this.player.poster : "",
    };

    setTimeout(() => {
      if (!this.options.urls?.enabled) {
        this.player.download = this.player.source;
      }
    }, 50);

    this.appendTracks(tracks);

    // Block playback in wp-admin
    this.player.on("play", () => {
      if (window.location.pathname.includes("/wp-admin")) {
        this.player.pause();
        this.player.currentTime = 0;
      }
    });

    // Activate all features
    if (typeof this.features === "object") {
      this.landScapeWhenFullscreen();
    }

    // Disable playback when watermark is loading
    this.player.on("play", () => {
      if (this.disabled) {
        this.player.currentTime = 0;
        this.player.pause();
      }
    });

    // Post-ready setup
    this.player.on("ready", () => {
      // Start time


      // Autoplay on frontend
      if (this.options.autoplay) {
        this.player?.play()?.catch?.((err: any) => {
          console.warn("Autoplay was blocked by browser policies. Video will load paused until user interaction.", err);
        });
      }

      this.controlTouchAction();

      // Small progress bar — move controls up
      const progressWidth = this.player.elements?.progress?.offsetWidth;
      if (progressWidth < 50) {
        this.player.elements?.container?.classList?.add("h5vp_progressbar_up");
      }
    });
  }

  reInit(): void {
    this.init();
  }

  /**
   * Replace the player's source, qualities, and captions at runtime.
   */
  setSource(source: string = "", qualities: any[] = [], captions: any[] = []): void {
    qualities = qualities || this.qualities;
    const sources = this.buildSources(qualities, source || this.player.source);
    const tracks = this.buildTracks(this.captions);

    this.player.source = {
      type: "video",
      title: "",
      sources,
      poster: this.player.poster && this.player.poster !== "false" ? this.player.poster : "",
    };

    this.appendTracks(tracks);

  }

  updateCaptions(): void {
    const tracks = this.buildTracks(this.captions);
    this.appendTracks(tracks);
  }

  setPoster(poster: string): void {
    if (this.player?.elements?.poster && poster) {
      this.player.elements.poster.style.backgroundImage = `url(${poster})`;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Source & Track Helpers (DRY)
  // ──────────────────────────────────────────────────────────────

  /**
   * Builds a normalized sources array from quality items + a fallback source.
   */
  private buildSources(qualities: QualityItem[] | null, fallbackSrc?: string): SourceInfo[] {
    const sources: SourceInfo[] =
      qualities
        ?.map((item) => ({
          type: this.getVideoMimeType(item?.video_file),
          size: parseInt(item.size as string),
          src: item.video_file,
        }))
        .filter((item) => item.src) || [];

    if (fallbackSrc) {
      sources.push({ src: fallbackSrc, type: this.getVideoMimeType(fallbackSrc), size: 720 });
    }

    return sources;
  }

  /**
   * Builds track metadata from caption items.
   */
  private buildTracks(captions: CaptionItem[] | null): TrackInfo[] {
    return (
      captions
        ?.map((item) => {
          if (!item.caption_file) return null;
          const [label, srclang] = item.label.split("/");
          return { kind: "captions", label, srclang, src: item.caption_file };
        })
        .filter(Boolean) as TrackInfo[]
    ) || [];
  }

  /**
   * Appends <track> elements to the player's media element.
   */
  private appendTracks(tracks: TrackInfo[]): void {
    tracks.forEach((track) => {
      if (track?.src) {
        const el = document.createElement("track");
        Object.assign(el, track);
        this.player.media.appendChild(el);
      }
    });
  }

  /**
   * Extracts the file extension from a path or URL.
   */
  private getFileExtension(path: string | undefined): string {
    if (!path) return "";
    return path.split(".").pop() || "";
  }

  private getVideoMimeType(path: string | undefined): string {
    if (!path) return "video/mp4";
    const ext = this.getFileExtension(path) as keyof typeof mimeTypes;
    const mimeTypes = {
      mp4: "video/mp4",
      m3u8: "application/x-mpegURL",
      mpd: "application/dash+xml",
      flv: "video/x-flv",
      mov: "video/quicktime",
      webm: "video/webm",
      ogv: "video/ogg",
      avi: "video/x-msvideo",
      "3gp": "video/3gpp",
    };

    return mimeTypes[ext] || "video/mp4";

  }


  /**
   * Locks screen orientation to landscape when entering fullscreen on mobile.
   */
  private landScapeWhenFullscreen(): void {
    if ((window?.innerWidth ?? Infinity) >= 992) return;

    this.player.on("enterfullscreen", () => {
      if (!this.player.fullscreen?.active) return;
      (screen?.orientation as any)?.lock?.("landscape")?.catch?.(() => { });
    });

    this.player.on("exitfullscreen", () => {
      // Only unlock when nothing on the page is in fullscreen.
      // Plyr fires exitfullscreen on OTHER player instances whenever ANY
      // player enters fullscreen (they detect they're not the fullscreen
      // element). Without this guard those handlers call unlock() and
      // immediately revert the landscape orientation.
      if (document.fullscreenElement) return;
      (screen?.orientation as any)?.unlock?.();
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Touch Controls
  // ──────────────────────────────────────────────────────────────

  /**
   * Enables swipe-to-seek and double-tap-to-seek on mobile/tablet in fullscreen.
   */
  private controlTouchAction(): void {
    if (document.body.offsetWidth > 992) return;

    const wrapper = this.player.elements?.container;
    if (!wrapper) return;

    const videoWrapper = wrapper.querySelector(".plyr__video-wrapper");
    const seekLabel = document.createElement("span");
    seekLabel.classList.add("seekSecond");
    videoWrapper.appendChild(seekLabel);

    // Remove Plyr's default double-click-to-fullscreen
    this.player.eventListeners.forEach(
      (evt: { type: string; callback: EventListenerOrEventListenerObject; options: boolean | AddEventListenerOptions }) => {
        if (evt.type === "dblclick") {
          wrapper.removeEventListener(evt.type, evt.callback, evt.options);
        }
      }
    );

    // Double-tap: seek or toggle fullscreen
    videoWrapper.parentNode.addEventListener("dblclick", (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (this.player.fullscreen.active) {
        if (videoWrapper.offsetWidth - 150 < x && videoWrapper.offsetWidth / 2 < x) {
          this.player.forward(this.options.seekTime);
          seekLabel.innerText = `${this.options.seekTime} sec`;
        } else if (videoWrapper.offsetWidth / 2 > x && x < 150) {
          this.player.rewind(this.options.seekTime);
          seekLabel.innerText = `-${this.options.seekTime} sec`;
        }
        setTimeout(() => { seekLabel.innerText = ""; }, 1000);
      }

      if (x > 150 && x < videoWrapper.offsetWidth - 150) {
        this.player.fullscreen.toggle();
      }
    });

    // Swipe to seek
    wrapper.addEventListener("touchstart", (e: TouchEvent) => {
      if (!this.player.fullscreen.active) return;
      this.touchClientX = e.touches[0].clientX;
      this.touchClientY = e.touches[0].clientY;
    }, false);

    wrapper.addEventListener("touchend", (e: TouchEvent) => {
      if (!this.player.fullscreen.active) return;
      const deltaX = e.changedTouches[0].clientX - this.touchClientX;

      if (deltaX > 5) {
        this.player.forward(deltaX / 10);
        seekLabel.innerText = `${deltaX / 10} sec`;
      } else if (deltaX < -5) {
        this.player.rewind(Math.abs(deltaX) / 10);
        seekLabel.innerText = `${deltaX / 10} sec`;
      }

      setTimeout(() => { seekLabel.innerText = ""; }, 1000);
    }, false);
  }


  destroy(): void {
    this.player?.destroy();
  }

  stop(): void {
    this.player?.stop();
  }

  on(eventName: string, callback: (...args: any[]) => void): void {
    if (this.player?.ready) {
      this.player.on(eventName, callback);
    } else {
      this.onEvents.push({ eventName, callback });
    }
  }


  setNonce(nonce: string): void {
    this.nonce = nonce;
  }

  setVideoId(videoId: string | number): void {
    this.videoId = videoId as number;
  }



  /**
   * Attaches a click event listener to an element, with a null check.
   */
  private onClick(element: HTMLElement | null, callback: () => void): void {
    element?.addEventListener("click", callback);
  }

  /**
   * Converts a DOM element's attributes to an array of key-value objects.
   */
  domAttributesToObjectList(elements: NodeListOf<Element>): Record<string, string>[] {
    return Array.from(elements).map((el) => {
      const result: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        result[attr.name] = attr.value;
      }
      return result;
    });
  }

  getStoredSettings(): any {
    return JSON.parse(window.localStorage.getItem("plyr")!);
  }

  /**
   * Returns a throttled version of the given function.
   */
  private throttle(fn: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let last = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  }

  private play() {
    this.player.play();
  }

  private pause() {
    this.player.pause();
  }
  private ended(fn: () => void) {
    this.player.on('ended', fn);
  }
}



// ────────────────────────────────────────────────────────────────
// Standalone Exports
// ────────────────────────────────────────────────────────────────

export const extractFileNamesWithoutExtension = (filePath: string): string => {
  const parts = filePath.split("/");
  const fileNameWithExtension = parts[parts.length - 1];
  return fileNameWithExtension.replace(/\.[^/.]+$/, "");
};

export default MyPlayer;
