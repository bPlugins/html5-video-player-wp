import { useRef, useState } from "react";
import { __ } from "@wordpress/i18n";
import { AudioEngine, clamp, formatTime } from "../useAudioEngine";
import { ARROW_SEEK_SECONDS } from "../constants";

interface ProgressBarProps {
    engine: AudioEngine;
    /** Show the buffered-ahead shading behind the played bar. */
    showBuffered?: boolean;
    /** Follow the cursor with a timestamp bubble while hovering the rail. */
    showTooltip?: boolean;
}

/**
 * Seekable progress rail shared by the default and compact skins.
 *
 * Keyboard seek used to live only in the minimal skin's waveform, even though
 * both of these rails already advertised role="slider" and tabIndex={0} —
 * so they were focusable but inert. Folding it in here fixes that for all of them.
 */
const ProgressBar = ({ engine, showBuffered = true, showTooltip = false }: ProgressBarProps) => {
    const barRef = useRef<HTMLDivElement | null>(null);
    const [hoverRatio, setHoverRatio] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState(0);

    const ratioFromClientX = (clientX: number) => {
        const bar = barRef.current;
        if (!bar) return null;
        const rect = bar.getBoundingClientRect();
        return { ratio: clamp((clientX - rect.left) / rect.width), offset: clientX - rect.left };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const hit = ratioFromClientX(e.clientX);
        if (!hit) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        engine.seekToRatio(hit.ratio);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const hit = ratioFromClientX(e.clientX);
        if (!hit) return;

        if (showTooltip) {
            setHoverRatio(hit.ratio);
            setHoverPos(hit.offset);
        }

        // Dragging: only seek while this element holds the pointer.
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            engine.seekToRatio(hit.ratio);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = engine.duration ? ARROW_SEEK_SECONDS / engine.duration : 0.05;
        const jump: Record<string, number> = {
            ArrowRight: engine.progress + step,
            ArrowUp: engine.progress + step,
            ArrowLeft: engine.progress - step,
            ArrowDown: engine.progress - step,
            Home: 0,
            End: 1
        };

        if (!(e.key in jump)) return;

        e.preventDefault();
        engine.seekToRatio(jump[e.key]);
    };

    return (
        <div
            className="h5vp-progress-wrapper"
            ref={barRef}
            role="slider"
            tabIndex={0}
            aria-label={__("Seek", "html5-video-player")}
            aria-valuemin={0}
            aria-valuemax={Math.round(engine.duration)}
            aria-valuenow={Math.round(engine.currentTime)}
            aria-valuetext={`${formatTime(engine.currentTime)} ${__("of", "html5-video-player")} ${formatTime(engine.duration)}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={showTooltip ? () => setHoverRatio(null) : undefined}
            onKeyDown={handleKeyDown}
        >
            {showTooltip && hoverRatio !== null && engine.duration > 0 && (
                <div className="h5vp-hover-tooltip" style={{ left: `${hoverPos}px` }}>
                    {formatTime(hoverRatio * engine.duration)}
                </div>
            )}

            <div className="h5vp-progress-rail">
                {showBuffered && (
                    <div className="h5vp-progress-buffered" style={{ width: `${engine.buffered * 100}%` }} />
                )}
                <div className="h5vp-progress-played" style={{ width: `${engine.progress * 100}%` }}>
                    <span className="h5vp-progress-thumb" />
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
