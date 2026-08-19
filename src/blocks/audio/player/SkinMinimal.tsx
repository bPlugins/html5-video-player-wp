/**
 * Minimal skin — modern chat/voice-memo waveform player.
 * Uses real/synthetic decoded audio peaks with seekable visual wave bars.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { __ } from "@wordpress/i18n";
import { AudioBlockAttributes } from "../types";
import useAudioWaveform from "./useAudioWaveform";
import { useAudioEngine, formatTime, clamp } from "./useAudioEngine";
import { ARROW_SEEK_SECONDS, BAR_GAP, BAR_WIDTH, MAX_BARS, MIN_BARS } from "./constants";
import AudioShell from "./parts/AudioShell";
import DownloadButton from "./parts/DownloadButton";
import PlayPauseButton from "./parts/PlayPauseButton";
import TimeDisplay from "./parts/TimeDisplay";
import VolumeControl from "./parts/VolumeControl";

const SkinMinimal = ({ attributes }: { attributes: AudioBlockAttributes }) => {
    const { source, autoplay, loop, preload, showDownload, showVolume = true } = attributes;

    const engine = useAudioEngine({ source, autoplay, loop, preload });
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [barCount, setBarCount] = useState(MIN_BARS);

    // Decoding the real waveform costs a second download of the whole file, so
    // hold it back until the listener actually starts playback. Until then the
    // deterministic placeholder stands in, and a visitor who scrolls past pays
    // nothing. Latched, so pausing does not discard the peaks.
    const [waveformRequested, setWaveformRequested] = useState(false);
    useEffect(() => {
        if (engine.isPlaying) {
            setWaveformRequested(true);
        }
    }, [engine.isPlaying]);

    const { peaks, isReady } = useAudioWaveform(source, barCount, waveformRequested);

    useEffect(() => {
        setWaveformRequested(false);
    }, [source]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const measure = (width: number) => {
            const fits = Math.floor((width + BAR_GAP) / (BAR_WIDTH + BAR_GAP));
            setBarCount(clamp(fits, MIN_BARS, MAX_BARS));
        };

        measure(track.getBoundingClientRect().width);

        if (typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width));
        observer.observe(track);
        return () => observer.disconnect();
    }, []);

    const seekToClientX = useCallback((clientX: number) => {
        const track = trackRef.current;
        if (!track) return;
        const { left, width } = track.getBoundingClientRect();
        const ratio = width ? (clientX - left) / width : 0;
        engine.seekToRatio(ratio);
    }, [engine]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seekToClientX(event.clientX);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            seekToClientX(event.clientX);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const step = engine.duration ? ARROW_SEEK_SECONDS / engine.duration : 0.05;
        const jump: Record<string, number> = {
            ArrowRight: engine.progress + step,
            ArrowUp: engine.progress + step,
            ArrowLeft: engine.progress - step,
            ArrowDown: engine.progress - step,
            Home: 0,
            End: 1,
        };

        if (!(event.key in jump)) return;

        event.preventDefault();
        engine.seekToRatio(jump[event.key]);
    };

    const playedBars = Math.round(engine.progress * barCount);

    return (
        <AudioShell
            engine={engine}
            className={`h5vp-skin-minimal h5vp-wave${engine.isPlaying ? " is-playing" : ""}${isReady ? " is-ready" : ""}`}
        >
            <PlayPauseButton engine={engine} />

            {/* Waveform Track — this skin's scrubber, in place of a plain rail */}
            <div
                ref={trackRef}
                className="h5vp-wave__track"
                role="slider"
                tabIndex={0}
                aria-label={__("Seek", "html5-video-player")}
                aria-valuemin={0}
                aria-valuemax={Math.round(engine.duration)}
                aria-valuenow={Math.round(engine.currentTime)}
                aria-valuetext={`${formatTime(engine.currentTime)} ${__("of", "html5-video-player")} ${formatTime(engine.duration)}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onKeyDown={handleKeyDown}
            >
                {peaks.map((peak, index) => (
                    <span
                        key={index}
                        className={`h5vp-wave__bar${index < playedBars ? " is-played" : ""}`}
                        style={{ height: `${Math.round(peak * 100)}%` }}
                    />
                ))}
            </div>

            {/* Before playback starts, show the total length rather than 0:00 */}
            <TimeDisplay
                seconds={engine.isPlaying || engine.progress ? engine.currentTime : engine.duration}
            />

            {showVolume && <VolumeControl engine={engine} />}
            {showDownload && <DownloadButton source={source} />}
        </AudioShell>
    );
};

export default SkinMinimal;
