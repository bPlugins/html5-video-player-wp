import { formatTime } from "../useAudioEngine";

/** Timestamp readout. Keeps the tabular-nums class in one place. */
const TimeDisplay = ({ seconds, className = "" }: { seconds: number; className?: string }) => (
    <span className={`h5vp-time ${className}`.trim()}>{formatTime(seconds)}</span>
);

export default TimeDisplay;
