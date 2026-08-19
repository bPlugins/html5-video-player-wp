import { useRef, useState } from "react";
import { __ } from "@wordpress/i18n";
import { AudioEngine, clamp } from "../useAudioEngine";
import useOutsideClick from "../useOutsideClick";
import { VolumeIcon } from "./Icons";

/**
 * Speaker button with a vertical volume slider in a popover.
 *
 * Owns its own open state — no skin needs to track it. The two pointer handlers
 * below were byte-identical in all four skins.
 */
const VolumeControl = ({ engine }: { engine: AudioEngine }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOutsideClick(wrapperRef, isOpen, () => setIsOpen(false));

    // Vertical track: full at the top, silent at the bottom.
    const setVolumeFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        engine.setVolume(clamp((rect.bottom - e.clientY) / rect.height, 0, 1));
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setVolumeFromPointer(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            setVolumeFromPointer(e);
        }
    };

    const level = engine.isMuted ? 0 : engine.volume;

    return (
        <div className="h5vp-vol-wrapper" ref={wrapperRef}>
            {isOpen && (
                <div className="h5vp-vol-popover">
                    <div
                        className="h5vp-vol-track"
                        role="slider"
                        tabIndex={0}
                        aria-label={__("Volume", "html5-video-player")}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(level * 100)}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                    >
                        <div className="h5vp-vol-rail">
                            <div className="h5vp-vol-fill" style={{ height: `${level * 100}%` }}>
                                <span className="h5vp-vol-thumb" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="button"
                className="h5vp-btn h5vp-btn-volume"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={
                    engine.isMuted || engine.volume === 0
                        ? __("Unmute", "html5-video-player")
                        : __("Volume", "html5-video-player")
                }
                aria-expanded={isOpen}
            >
                <VolumeIcon isMuted={engine.isMuted} volume={engine.volume} />
            </button>
        </div>
    );
};

export default VolumeControl;
