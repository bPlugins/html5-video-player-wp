import { __ } from "@wordpress/i18n";
import { AudioEngine } from "../useAudioEngine";
import { SKIP_SECONDS } from "../constants";
import { IconSkipBack, IconSkipForward } from "./Icons";

/** Jump button with the seconds count badged onto the arrow. */
const SkipButton = ({
    engine,
    direction
}: {
    engine: AudioEngine;
    direction: "back" | "forward";
}) => {
    const isBack = direction === "back";
    const label = isBack
        ? __("Rewind 10s", "html5-video-player")
        : __("Forward 10s", "html5-video-player");

    return (
        <button
            type="button"
            className="h5vp-btn h5vp-btn-skip"
            onClick={() => engine.skip(isBack ? -SKIP_SECONDS : SKIP_SECONDS)}
            title={label}
            aria-label={label}
        >
            {isBack ? <IconSkipBack /> : <IconSkipForward />}
            <span className="h5vp-skip-badge">{SKIP_SECONDS}</span>
        </button>
    );
};

export default SkipButton;
