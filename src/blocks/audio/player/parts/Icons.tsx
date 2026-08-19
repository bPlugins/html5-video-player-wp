/**
 * Single source of truth for every audio-player glyph.
 *
 * Each skin used to inline its own copy of these paths, which let them drift:
 * one skin shipped a three-state volume icon while the others only had two, and
 * the download arrow gained rounded caps in two copies but not the other two.
 * The versions here are the most complete of each, so all four skins converge.
 *
 * Every icon is decorative — the button that wraps it carries the aria-label —
 * so they are all aria-hidden and removed from the tab order.
 */

const A11Y = { "aria-hidden": true, focusable: "false" } as const;

const SOLID = { viewBox: "0 0 24 24", fill: "currentColor", ...A11Y } as const;

const STROKE = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...A11Y
} as const;

export const IconPlay = () => (
    <svg {...SOLID}>
        <path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.2-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2Z" />
    </svg>
);

export const IconPause = () => (
    <svg {...SOLID}>
        <rect x="6" y="4" width="4" height="16" rx="1.5" />
        <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
);

export const IconSkipBack = () => (
    <svg {...STROKE}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

export const IconSkipForward = () => (
    <svg {...STROKE}>
        <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
);

const SPEAKER = "m11 5-6 4H2v6h3l6 4V5z";

export const IconVolumeMute = () => (
    <svg {...STROKE}>
        <path d={SPEAKER} />
        <line x1="22" y1="9" x2="16" y2="15" />
        <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
);

export const IconVolumeLow = () => (
    <svg {...STROKE}>
        <path d={SPEAKER} />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
);

export const IconVolumeHigh = () => (
    <svg {...STROKE}>
        <path d={SPEAKER} />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

export const IconDownload = () => (
    <svg {...STROKE}>
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
        <path d="M4 19h16" />
    </svg>
);

export const IconDisc = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...A11Y}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/**
 * Picks the speaker glyph for the current output level. All four skins now get
 * the three-state treatment that only the default skin used to have.
 */
export const VolumeIcon = ({ isMuted, volume }: { isMuted: boolean; volume: number }) => {
    if (isMuted || volume === 0) return <IconVolumeMute />;
    if (volume < 0.5) return <IconVolumeLow />;
    return <IconVolumeHigh />;
};
