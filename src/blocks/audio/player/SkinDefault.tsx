/**
 * Default skin — single-row bar: transport, timestamps, scrubber, extras.
 */
import { AudioBlockAttributes } from "../types";
import { useAudioEngine } from "./useAudioEngine";
import AudioShell from "./parts/AudioShell";
import DownloadButton from "./parts/DownloadButton";
import PlayPauseButton from "./parts/PlayPauseButton";
import ProgressBar from "./parts/ProgressBar";
import SkipButton from "./parts/SkipButton";
import SpeedControl from "./parts/SpeedControl";
import TimeDisplay from "./parts/TimeDisplay";
import VolumeControl from "./parts/VolumeControl";

const SkinDefault = ({ attributes }: { attributes: AudioBlockAttributes }) => {
    const {
        source,
        autoplay,
        loop,
        preload,
        showDownload,
        showSpeed = true,
        showSkip = true,
        showVolume = true
    } = attributes;

    const engine = useAudioEngine({ source, autoplay, loop, preload });

    return (
        <AudioShell engine={engine} className="h5vp-skin-default">
            <div className="h5vp-default-controls">
                <PlayPauseButton engine={engine} />

                {showSkip && <SkipButton engine={engine} direction="back" />}
                {showSkip && <SkipButton engine={engine} direction="forward" />}

                <TimeDisplay seconds={engine.currentTime} className="h5vp-time-current" />

                <ProgressBar engine={engine} showTooltip />

                <TimeDisplay seconds={engine.duration} className="h5vp-time-duration" />

                {showSpeed && <SpeedControl engine={engine} />}
                {showVolume && <VolumeControl engine={engine} />}
                {showDownload && <DownloadButton source={source} />}
            </div>
        </AudioShell>
    );
};

export default SkinDefault;
