import { useRef, useState } from "react";
import { __ } from "@wordpress/i18n";
import { AudioEngine } from "../useAudioEngine";
import { SPEEDS } from "../constants";
import useOutsideClick from "../useOutsideClick";

/** Playback-rate button with its popover list. Owns its own open state. */
const SpeedControl = ({ engine }: { engine: AudioEngine }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOutsideClick(wrapperRef, isOpen, () => setIsOpen(false));

    return (
        <div className="h5vp-speed-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className={`h5vp-btn h5vp-btn-speed ${isOpen ? "is-active" : ""}`.trim()}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={__("Playback Speed", "html5-video-player")}
                aria-expanded={isOpen}
            >
                {engine.playbackRate}x
            </button>

            {isOpen && (
                <div className="h5vp-speed-popover">
                    {SPEEDS.map((speed) => (
                        <button
                            key={speed}
                            type="button"
                            className={`h5vp-speed-item ${engine.playbackRate === speed ? "is-selected" : ""}`.trim()}
                            onClick={() => {
                                engine.setPlaybackRate(speed);
                                setIsOpen(false);
                            }}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpeedControl;
