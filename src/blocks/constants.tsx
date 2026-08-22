/**
 * Shared constants for src/blocks.
 *
 * - Camera SVG icon (previously duplicated in video/Edit, vimeo/Edit,
 *   youtube/Edit, parent/Edit).
 */

import { PresetProps } from "./types";

type AttributesProps = Record<string, any>;

/** Camera / video-camera SVG icon used as the block placeholder icon. */
export const cameraIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="html5-block-icon"
  >
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

export const youtubeIcon = (size = "20") => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="-21 -117 682.667 682" fill="currentColor" > <path d="M626.813 64.035c-7.375-27.418-28.993-49.031-56.407-56.414C520.324-6.082 319.992-6.082 319.992-6.082s-200.324 0-250.406 13.184c-26.887 7.375-49.031 29.52-56.406 56.933C0 114.113 0 217.97 0 217.97s0 104.379 13.18 153.933c7.382 27.414 28.992 49.028 56.41 56.41C120.195 442.02 320 442.02 320 442.02s200.324 0 250.406-13.184c27.418-7.379 49.032-28.992 56.414-56.406 13.176-50.082 13.176-153.934 13.176-153.934s.527-104.383-13.183-154.46zM256.21 313.915V122.022l166.586 95.946zm0 0"> </path></svg>

export const vimeoIcon = (size = "20") => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
  <path d="M20.497 1.505c-3.328-.121-5.576 1.787-6.762 5.694a4.312 4.312 0 011.777-.395c1.219 0 1.758.697 1.614 2.082-.072.839-.608 2.059-1.612 3.664-1.009 1.605-1.763 2.409-2.265 2.409-1.522 0-2.437-7.284-2.747-9.273-.431-2.765-1.58-4.058-3.447-3.877C5.341 1.972 2.35 5.058 0 7.15l1.129 1.472C2.204 7.86 2.831 7.478 3.01 7.478c1.871 0 2.777 6.367 4.23 11.102.975 2.613 2.144 3.92 3.553 3.92 2.264 0 5.022-2.144 8.29-6.434 3.155-4.107 4.789-7.344 4.894-9.705l.013-.01c.134-3.165-1.021-4.785-3.493-4.846z"></path>
</svg>

/** Music note SVG icon, used for the audio player type. */
export const audioIcon = (size = "24") => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="html5-block-icon">
  <path d="M9 18V5l12-2v13"></path>
  <circle cx="6" cy="18" r="3"></circle>
  <circle cx="18" cy="16" r="3"></circle>
</svg>;

/** Playlist SVG icon, used for the playlist player type. */
export const playlistIcon = (size = "24") => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="html5-block-icon"
  >
    <path d="m16 10 5 3-5 3v-6Z"></path>
    <path d="M3 6h18"></path>
    <path d="M3 12h9"></path>
    <path d="M3 18h9"></path>
  </svg>
);


export const DEFAULT_ATTRIBUTES: AttributesProps = {
  options: {
    controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "captions", "settings", "fullscreen"],
    playsinline: true,
    hideControls: true,
    seekTime: 10,
    preload: "",
    speed: { options: [0.5, 1, 1.5, 2] },
    ratio: null,
  },
  preload: 'metadata',
  features: {
    saveState: true,
    endScreen: {
      enabled: false,
      text: "",
      btnLink: "",
      btnText: "",
      btnStyle: {

      }
    },
    watermark: {
      enabled: false,
      type: "email",
      // position: "",
      text: "",
      color: 'red'
    },
    sticky: {
      enabled: false,
      position: "top-right"
    },
    hideYoutubeUI: false,
    hideLoadingPlaceholder: false,
    emailCapture: {
      enabled: false,
      displayAt: 10,
      allowSkipping: true,
      heading: "",
      bottomText: "",
      buttonText: "",
      buttonColor: {
        color: "#fff",
        bg: window.h5vpBlock?.brandColor || "#000"
      },
      roundCorner: '5px',
      integration: '',
      webhook: {
        url: '',
        name: '',
        method: 'POST',
        email_name: 'email',
        headers: []
      },
      fluentCRM: {
        list_ids: [],
        tag_ids: [],
      }
    }
  },
  skin: 'default'
};



export const DEFAULT_PRESETS: PresetProps[] = [
  {
    id: "default",
    name: "Default",
    icon: <svg id="Layer_1" height="50" viewBox="0 0 28 28" width="50" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m6.26 3.67 4.33 4.33h-7.5a5.96 5.96 0 0 1 3.17-4.33zm5.82-.67h-3.08c-.19 0-.38.01-.57.02l4.98 4.98h3.67zm6.92 0h-4.08l5 5h4.99a5.99 5.99 0 0 0 -5.91-5zm-6.5181 16.626 5-2.75a.9992.9992 0 0 0 0-1.752l-5-2.75a1 1 0 0 0 -1.4819.876v5.5a1 1 0 0 0 1.4819.876zm12.5181-9.626v9a6.0048 6.0048 0 0 1 -6 6h-10a6.0048 6.0048 0 0 1 -6-6v-9z" fill="#0a0b12" /></svg>,
    settings: JSON.stringify({
      options: {
        controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
        playsinline: true,
        hideControls: true,
        seekTime: 10,
        preload: "",
        speed: { options: [0.5, 1, 1.5, 2] },
        ratio: null,
      },
      preload: "metadata",
      features: { saveState: true },
      skin: "default",
    }),
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 163.861 163.861" xmlSpace="preserve"> <g> <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275 c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z" /> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>,
    settings: JSON.stringify({
      options: {
        controls: ["play-large"],
        playsinline: true,
        hideControls: true,
        seekTime: 10,
        preload: "",
        speed: { options: [0.5, 1, 1.5, 2] },
        ratio: null,
      },
      preload: "metadata",
      features: { saveState: false },
      skin: "default",
    }),
  },
  {
    id: "simple",
    name: "Simple",
    icon: <svg id="svg1767" xmlSpace="preserve" width={40} height={40} viewBox="0 0 682.66669 682.66669" xmlns="http://www.w3.org/2000/svg"> <defs id="defs1771"> <clipPath clipPathUnits="userSpaceOnUse" id="clipPath1781"> <path d="M 0,512 H 512 V 0 H 0 Z" id="path1779" /> </clipPath> </defs> <g id="g1773" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)"> <g id="g1775"> <g id="g1777" clipPath="url(#clipPath1781)"> <g id="g1783" transform="translate(211.1337,462)"> <path d="m 0,0 h -161.134 c -22.091,0 -40,-17.909 -40,-40 v -332 c 0,-22.091 17.909,-40 40,-40 h 412 c 22.092,0 40,17.909 40,40 v 332 c 0,22.091 -17.908,40 -40,40 H 90" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1785" /> </g> <g id="g1787" transform="translate(10,170)"> <path d="M 0,0 H 492" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1789" /> </g> <g id="g1791" transform="translate(119.9244,110)"> <path d="m 0,0 c 0,-11.046 -8.954,-20 -20,-20 -11.046,0 -20,8.954 -20,20 0,11.046 8.954,20 20,20 C -8.954,20 0,11.046 0,0 Z" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1793" /> </g> <g id="g1795" transform="translate(182.9897,110)"> <path d="M 0,0 H 249.086" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1797" /> </g> <g id="g1799" transform="translate(242.6652,362.3616)"> <path d="m 0,0 52.52,-30.323 c 12.347,-7.128 12.347,-24.949 0,-32.078 L 0,-92.723 c -12.347,-7.129 -27.78,1.782 -27.78,16.039 v 60.645 C -27.78,-1.782 -12.347,7.129 0,0 Z" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1801" /> </g> <g id="g1803" transform="translate(256.127,462)"> <path d="M 0,0 V 0" style={{ fill: "none", stroke: "#000000", strokeWidth: 20, strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: 10, strokeDasharray: "none", strokeOpacity: 1, }} id="path1805" /> </g> </g> </g> </g> </svg>,
    settings: JSON.stringify({
      options: {
        controls: ["play-large", "play", "progress", "current-time", "mute", "captions", "fullscreen"],
        playsinline: true,
        hideControls: true,
        seekTime: 10,
        preload: "",
        speed: { options: [0.5, 1, 1.5, 2] },
        ratio: null,
      },
      preload: "metadata",
      features: { saveState: false },
      skin: "default",
    }),
  },
  {
    id: "course",
    name: "Course",
    icon: <svg clip-rule="evenodd" fill-rule="evenodd" height="50" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" width="50" xmlns="http://www.w3.org/2000/svg"><g id="Icon"><path d="m16.25 19.492v1.258c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.25h1.25c.084 0 .167-.003.25-.008z" /><path d="m14.75 19.5h-6.75c-2.071 0-3.75-1.679-3.75-3.75v-3.082l5.714 3.157c1.238.684 2.834.684 4.072 0l.714-.394zm1.5-4.898 3.5-1.934v3.082c0 1.987-1.545 3.613-3.5 3.742z" /><path d="m14.75 14.288-1.198.662c-.944.522-2.16.522-3.104 0l-8.314-4.594c-.566-.313-.884-.861-.884-1.434 0-.574.318-1.122.884-1.434l8.314-4.595c.944-.521 2.16-.521 3.104 0l8.314 4.595c.566.312.884.86.884 1.434 0 .573-.318 1.121-.884 1.434l-5.616 3.103v-.709c0-.199-.079-.39-.22-.53l-3.5-3.5c-.292-.293-.768-.293-1.06 0-.293.292-.293.768 0 1.06l3.28 3.281z" /></g></svg>,
    settings: JSON.stringify({
      options: {
        controls: ["play-large", "rewind", "play", "fast-forward", "progress", "current-time", "duration", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
        playsinline: true,
        hideControls: true,
        seekTime: 10,
        preload: "",
        speed: { options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        ratio: "21:9",
      },
      preload: "metadata",
      features: { saveState: true },
      skin: "default",
      styles: {
        plyr_wrapper: {
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        },
      },
    }),
  },
];
