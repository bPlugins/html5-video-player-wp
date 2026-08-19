/**
 * Podcast skin — artwork card with track metadata above a full control row.
 */
import { __ } from "@wordpress/i18n";
import { AudioBlockAttributes } from "../types";
import { useAudioEngine } from "./useAudioEngine";
import { getFileName } from "./utils";
import AudioShell from "./parts/AudioShell";
import DownloadButton from "./parts/DownloadButton";
import { IconDisc } from "./parts/Icons";
import PlayPauseButton from "./parts/PlayPauseButton";
import ProgressBar from "./parts/ProgressBar";
import SkipButton from "./parts/SkipButton";
import SpeedControl from "./parts/SpeedControl";
import TimeDisplay from "./parts/TimeDisplay";
import VolumeControl from "./parts/VolumeControl";

const SkinPodcast = ({ attributes }: { attributes: AudioBlockAttributes }) => {
    const {
        source,
        autoplay,
        loop,
        preload,
        title,
        artist,
        artwork,
        showDownload,
        showSpeed = true,
        showSkip = true,
        showVolume = true
    } = attributes;

    const engine = useAudioEngine({ source, autoplay, loop, preload });

    const displayTitle = title || getFileName(source) || __("Audio Track", "html5-video-player");
    const displayArtist = artist || "";

    return (
        <AudioShell engine={engine} className="h5vp-skin-podcast">
            <div className="h5vp-podcast-card">
                {/* Header with Artwork & Track Info */}
                <div className="h5vp-podcast-header">
                    <div className="h5vp-podcast-artwork">
                        {artwork ? (
                            <img src={artwork} alt={displayTitle} />
                        ) : (
                            <div className="h5vp-podcast-art-fallback">
                                <IconDisc />
                            </div>
                        )}
                    </div>

                    <div className="h5vp-podcast-meta">
                        <div className="h5vp-podcast-title" title={displayTitle}>
                            {displayTitle}
                        </div>
                        {displayArtist && (
                            <div className="h5vp-podcast-artist" title={displayArtist}>
                                {displayArtist}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrubber & Timestamps */}
                <div className="h5vp-podcast-scrubber-row">
                    <ProgressBar engine={engine} />
                    <div className="h5vp-podcast-time-row">
                        <TimeDisplay seconds={engine.currentTime} />
                        <TimeDisplay seconds={engine.duration} />
                    </div>
                </div>

                {/* Main Action Controls */}
                <div className="h5vp-podcast-actions">
                    <div className="h5vp-podcast-action-left">
                        {showSpeed && <SpeedControl engine={engine} />}
                    </div>

                    <div className="h5vp-podcast-action-center">
                        {showSkip && <SkipButton engine={engine} direction="back" />}
                        <PlayPauseButton engine={engine} />
                        {showSkip && <SkipButton engine={engine} direction="forward" />}
                    </div>

                    <div className="h5vp-podcast-action-right">
                        {showVolume && <VolumeControl engine={engine} />}
                        {showDownload && <DownloadButton source={source} />}
                    </div>
                </div>
            </div>
        </AudioShell>
    );
};

export default SkinPodcast;
