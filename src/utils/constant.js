import { __ } from "@wordpress/i18n";

export const analyticsAjaxArgs = (method) => {
  return {
    nonce: window.h5vpAnalytics.nonce,
    model: "ViewsModel",
    method,
  };
};

export const helpText = {
  autoplay: __("Automatically start playing the video when the page loads.", "html5-video-player"),
  repeat: __("Automatically replay the video from the beginning after it ends.", "html5-video-player"),
  muted: __("Start the video with sound turned off by default.", "html5-video-player"),
  resetOnEnd: __("Reset the video to the beginning when playback finishes.", "html5-video-player"),
  autoHideControls: __("Hide video controls automatically after 2s of no mouse or focus movement", "html5-video-player"),
  hideLoadingPlaceholder: __("Hide the loading image or placeholder while the video is loading.", "html5-video-player"),
  playWhenVisible: __("Automatically play the video when it becomes visible in the viewport.", "html5-video-player"),
  disablePause: __("Prevent users from pausing the video during playback.", "html5-video-player"),
  playsinline: __("Allow inline playback on iOS. Note this has no effect on iPadOS.", "html5-video-player"),
  saveState: __("Remember the last playback position and resume from it when replayed.", "html5-video-player"),
  thumbInPause: __("Show the video thumbnail image when the video is paused.", "html5-video-player"),
  stickyOnScroll: __("Keep the mini video player visible on screen while scrolling the page.", "html5-video-player"),
  stickyPosition: __("Choose where the sticky video player appears on the screen.", "html5-video-player"),
  startTime: __("The video will begin playing from this specified time.", "html5-video-player"),
  seekTime: __("The time, in seconds, to seek when a user hits fast forward or rewind.", "html5-video-player"),
  videoRatio: __("Select the width-to-height ratio used to display the video.", "html5-video-player"),
  preload: __("Control how much of the video is loaded before playback. Options affect loading speed and bandwidth usage.", "html5-video-player"),
  customCSSSelector: __("Enter a CSS selector for a custom button that will start the video when clicked.", "html5-video-player"),
  tagUrl: __("Enter the Google VAST ad tag URL to display video ads before or during playback.", "html5-video-player"),
  overlay: __("Display an overlay (Image or Text) on top of the video player.", "html5-video-player"),
  overlayType: __("Choose whether to show an image or text as the video overlay.", "html5-video-player"),
  overlayPosition: __("Select the position on the video where the overlay will appear.", "html5-video-player"),
  overlayLogo: __("Upload an image to display as an overlay on the video.", "html5-video-player"),
  overlayText: __("Add a clickable link to the overlay image or text.", "html5-video-player"),
  overlayLink: __("Enter the URL that the overlay will link to when clicked.", "html5-video-player"),
  overlayOpacity: __("Adjust the transparency level of the overlay.", "html5-video-player"),
  hideYoutubeUI: __("Hide YouTube player interface elements for a cleaner video display.", "html5-video-player"),
  endScreen: __("Display a custom screen or message when the video finishes playing.", "html5-video-player"),
  allowedUserRoles: __("Select which WordPress user roles are allowed to view the video.", "html5-video-player"),
  captionLabel: __("Enter the subtitle label with language name and code (e.g., English / en).", "html5-video-player"),
  captionFile: __("Only .vtt file accept", "html5-video-player"),
  watermark: __("Display a watermark image or text over the video to protect branding.", "html5-video-player"),
  watermarkType: __("Choose whether to show user email, username, or custom text as the watermark.", "html5-video-player"),
  watermarkText: __("Enter the custom text to display as the watermark.", "html5-video-player"),
  watermarkColor: __("Choose the color used for the watermark text.", "html5-video-player"),
  popup: __("Open the video in a popup window when triggered.", "html5-video-player"),
  useExistingBtn: __("Use an existing button on the page to trigger the popup video.", "html5-video-player"),
  popupBtnClass: __("Enter the CSS class name of the button that opens the video popup.", "html5-video-player"),
  passwordProtected: __("Require a password to view or play this video.", "html5-video-player"),
  password: __("Enter the password required to access this video.", "html5-video-player"),
  whoCanSeeThisVideo: __("Control which user roles or is only users are allowed to view this video.", "html5-video-player"),
  skin: __("Choose a skin for the video player.", "html5-video-player"),
  // startTime: __("", "html5-video-player"),
  // startTime: __("", "html5-video-player"),
  // startTime: __("", "html5-video-player"),
};

// export const settingsControls = [
//   {
//     label: __("Autoplay", "html5-video-player"),
//     help: helpText.autoplay,
//     info: helpText.autoplay,
//     id: "autoplay",
//     checked: autoplay,
//     onChange: () => handleOptions({ autoplay: !autoplay }),
//   }
// ]


export const plyrControls = [
  {
    label: "Play Large",
    control: "play-large",
  },
  {
    label: "Restart",
    control: "restart",
  },
  {
    label: "Rewind",
    control: "rewind",
  },
  {
    label: "Play",
    control: "play",
  },
  {
    label: "Fast Forward",
    control: "fast-forward",
  },
  {
    label: "Progress",
    control: "progress",
  },
  {
    label: "Current Time",
    control: "current-time",
  },
  {
    label: "Duration",
    control: "duration",
  },
  {
    label: "Mute",
    control: "mute",
  },
  {
    label: "Volume",
    control: "volume",
  },
  {
    label: "PIP",
    control: "pip",
  },
  {
    label: "Airplay",
    control: "airplay",
  },
  {
    label: "Captions",
    control: "captions",
  },
  {
    label: "Settings",
    control: "settings",
  },
  {
    label: "Download",
    control: "download",
  },
  {
    label: "Fullscreen",
    control: "fullscreen",
  },
];

//update the controls to this sort
export const originalControls = [
  'play-large', // The large play button in the center
  'restart', // Restart playback
  'rewind', // Rewind by the seek time (default 10 seconds)
  'play', // Play/pause playback
  'fast-forward', // Fast forward by the seek time (default 10 seconds)
  'progress', // The progress bar and scrubber for playback and buffering
  'current-time', // The current time of playback
  'duration', // The full duration of the media
  'mute', // Toggle mute
  'volume', // Volume control
  'captions', // Toggle captions
  'settings', // Settings menu
  'pip', // Picture-in-picture (currently Safari only)
  'airplay', // Airplay (currently Safari only)
  'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
  'fullscreen', // Toggle fullscreen
];