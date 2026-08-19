import { __ } from "@wordpress/i18n";
import { AudioEngine } from "../useAudioEngine";
import { IconPause, IconPlay } from "./Icons";

/**
 * Primary transport button. `className` lets a skin add its own size/shape
 * modifier without reinventing the label and icon swap.
 */
const PlayPauseButton = ({ engine, className = "" }: { engine: AudioEngine; className?: string }) => (
    <button
        type="button"
        className={`h5vp-btn h5vp-btn-play ${className}`.trim()}
        onClick={engine.togglePlay}
        aria-label={engine.isPlaying ? __("Pause", "html5-video-player") : __("Play", "html5-video-player")}
    >
        {engine.isPlaying ? <IconPause /> : <IconPlay />}
    </button>
);

export default PlayPauseButton;
