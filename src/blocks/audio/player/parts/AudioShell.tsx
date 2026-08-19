import { ReactNode } from "react";
import { AudioEngine } from "../useAudioEngine";

/**
 * Skin root: the native <audio> element plus the skin's outer div. Lets each
 * skin file be nothing but layout.
 */
const AudioShell = ({
    engine,
    className,
    children
}: {
    engine: AudioEngine;
    className: string;
    children: ReactNode;
}) => (
    <div className={className}>
        <audio {...engine.audioProps} className="h5vp-audio-native-el" />
        {children}
    </div>
);

export default AudioShell;
