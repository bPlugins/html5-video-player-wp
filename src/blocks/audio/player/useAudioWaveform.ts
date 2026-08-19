
import { useEffect, useMemo, useState } from "react";

// Buckets stored per file — fine-grained enough to resample down to any bar
// count the player can show.
const RESOLUTION = 512;

// Enough for ~512 buckets of a multi-hour file; well below what any real
// waveform rendering can resolve.
const DECODE_SAMPLE_RATE = 8000;

const MAX_DECODE_BYTES = 60 * 1024 * 1024;

const peakCache = new Map<string, number[]>();

// Sources that returned nothing usable (too big, CORS-blocked, undecodable).
// Without this a remounting player retries the same doomed fetch forever.
const skipCache = new Set<string>();

// Deterministic 32-bit hash so the same file always gets the same placeholder.
const hashString = (value: string) => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

/**
 * Placeholder waveform: quiet at the edges, busiest in the middle, so it reads
 * as a recording instead of a loading skeleton.
 */
const placeholderPeaks = (source: string, barCount: number) => {
    let seed = hashString(source) || 1;
    const random = () => {
        // xorshift32 — cheap, seeded, and free of Math.random() so the shape is
        // identical on every render and between editor and front end.
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return ((seed >>> 0) % 1000) / 1000;
    };

    return Array.from({ length: barCount }, (_, index) => {
        const envelope = Math.sin((Math.PI * (index + 0.5)) / barCount) ** 1.6;
        return Math.min(1, 0.12 + envelope * (0.35 + random() * 0.65));
    });
};

const normalize = (peaks: number[]) => {
    const loudest = Math.max(...peaks);
    if (!loudest) {
        return null;
    }
    // Floor every bar so silence still shows a hairline instead of a gap.
    return peaks.map((peak) => Math.max(0.06, Math.min(1, peak / loudest)));
};

const resample = (peaks: number[], barCount: number) => {
    if (peaks.length === barCount) {
        return peaks;
    }

    const perBar = peaks.length / barCount;
    const resampled = Array.from({ length: barCount }, (_, bar) => {
        const start = Math.floor(bar * perBar);
        const end = Math.max(start + 1, Math.floor((bar + 1) * perBar));
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += peaks[i];
        }
        return sum / (end - start);
    });

    return normalize(resampled) || resampled;
};

const bufferToPeaks = (buffer: AudioBuffer) => {
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    const samplesPerBucket = Math.floor(buffer.length / RESOLUTION) || 1;
    const peaks: number[] = [];

    for (let bucket = 0; bucket < RESOLUTION; bucket++) {
        const start = bucket * samplesPerBucket;
        const end = Math.min(start + samplesPerBucket, buffer.length);
        let sum = 0;
        let count = 0;

        // RMS over a sparse sample of the window — plenty at this resolution and
        // it keeps long files from blocking the main thread.
        const step = Math.max(1, Math.floor((end - start) / 200));
        for (let i = start; i < end; i += step) {
            for (const channel of channels) {
                sum += channel[i] * channel[i];
            }
            count += channels.length;
        }

        peaks.push(count ? Math.sqrt(sum / count) : 0);
    }

    return normalize(peaks);
};

/**
 * An OfflineAudioContext fixed at {@link DECODE_SAMPLE_RATE}, so decodeAudioData
 * resamples on the way in instead of handing back device-rate PCM. Falls back to
 * a regular AudioContext where the offline one refuses the low rate.
 */
const createDecodeContext = (): BaseAudioContext | null => {
    const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (OfflineCtx) {
        try {
            return new OfflineCtx(1, 1, DECODE_SAMPLE_RATE);
        } catch {
            /* Rate outside the browser's accepted range — fall through. */
        }
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    return AudioCtx ? new AudioCtx() : null;
};

const decodePeaks = async (source: string, signal: AbortSignal) => {
    const context = createDecodeContext();
    if (!context) {
        return null;
    }

    try {
        // Same plain GET the <audio> element issues, so the browser can serve
        // this from its HTTP cache rather than pulling the file down twice.
        const response = await fetch(source, { signal, mode: "cors" });
        if (!response.ok) {
            return null;
        }

        const declaredLength = Number(response.headers.get("content-length"));
        if (Number.isFinite(declaredLength) && declaredLength > MAX_DECODE_BYTES) {
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_DECODE_BYTES) {
            // Streamed responses omit Content-Length, so re-check the real size
            // before committing to the decode.
            return null;
        }

        return bufferToPeaks(await context.decodeAudioData(arrayBuffer));
    } finally {
        (context as any).close?.();
    }
};

/**
 * @param source    Audio file URL.
 * @param barCount  How many bars the player currently has room for.
 * @param enabled   Gate on the decode. Pass `false` until the listener has shown
 *                  intent (first play) — see the note at the top of this file.
 */
const useAudioWaveform = (source: string, barCount: number, enabled = false) => {
    const [decoded, setDecoded] = useState<number[] | null>(() => peakCache.get(source) || null);

    useEffect(() => {
        const cached = peakCache.get(source);
        setDecoded(cached || null);

        if (!source || cached || !enabled || skipCache.has(source)) {
            return;
        }

        const controller = new AbortController();
        let active = true;

        decodePeaks(source, controller.signal)
            .then((peaks) => {
                if (!peaks) {
                    skipCache.add(source);
                    return;
                }
                peakCache.set(source, peaks);
                if (active) {
                    setDecoded(peaks);
                }
            })
            .catch((err) => {
                /* Unreachable file, CORS block or undecodable format — keep the placeholder. */
                if (err?.name !== "AbortError") {
                    skipCache.add(source);
                }
            });

        return () => {
            active = false;
            controller.abort();
        };
    }, [source, enabled]);

    const peaks = useMemo(
        () => (decoded ? resample(decoded, barCount) : placeholderPeaks(source, barCount)),
        [decoded, source, barCount]
    );

    return { peaks, isReady: !!decoded };
};

export default useAudioWaveform;
