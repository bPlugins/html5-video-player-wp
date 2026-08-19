/**
 * Compact skin — everything on one inline pill.
 */
import { AudioBlockAttributes } from "../types";
import { useAudioEngine } from "./useAudioEngine";
import AudioShell from "./parts/AudioShell";
import DownloadButton from "./parts/DownloadButton";
import PlayPauseButton from "./parts/PlayPauseButton";
import ProgressBar from "./parts/ProgressBar";
import TimeDisplay from "./parts/TimeDisplay";
import VolumeControl from "./parts/VolumeControl";

const SkinCompact = ({ attributes }: { attributes: AudioBlockAttributes }) => {
    const { source, autoplay, loop, preload, showDownload, showVolume = true } = attributes;

    const engine = useAudioEngine({ source, autoplay, loop, preload });

    return (
        <AudioShell engine={engine} className="h5vp-skin-compact">
            <div className="h5vp-compact-pill">
                <PlayPauseButton engine={engine} />

                <TimeDisplay seconds={engine.currentTime} className="h5vp-time-current" />

                <ProgressBar engine={engine} />

                <TimeDisplay seconds={engine.duration} className="h5vp-time-duration" />

                {showVolume && <VolumeControl engine={engine} />}
                {showDownload && <DownloadButton source={source} />}
            </div>
        </AudioShell>
    );
};

export default SkinCompact;
