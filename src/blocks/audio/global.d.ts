export {};

declare global {
  interface Window {
    // Localized by blocks.php's localize_audio_block() — kept separate from the
    // shared window.h5vpBlock the video pipeline uses, so this block never
    // depends on that bootstrap.
    h5vpAudioBlock?: {
      brandColor?: string;
      iconUrl?: string;
    };
  }
}
