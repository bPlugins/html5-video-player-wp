import { useState, useEffect } from "react";
import { PlaylistProvider } from "src/blocks/playlist/types";

const durationCache = new Map<string, string>();
type DurationListener = (url: string, duration: string) => void;
const listeners = new Set<DurationListener>();

/**
 * Format duration in seconds into 'm:ss' or 'h:mm:ss'
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds <= 0) {
    return "";
  }
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  if (hours > 0) {
    const paddedMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }

  return `${minutes}:${paddedSecs}`;
};

/**
 * Update duration in cache from Plyr / player and notify list item subscribers
 */
export const setCachedDuration = (url: string, durationStr: string) => {
  if (!url || !durationStr) return;
  durationCache.set(url, durationStr);
  listeners.forEach((listener) => {
    try {
      listener(url, durationStr);
    } catch (err) {
      // ignore
    }
  });
};

/**
 * Reads duration from custom override, Plyrio player playback, or self-hosted metadata.
 */
export const useVideoDuration = (
  url?: string,
  provider: PlaylistProvider = "library",
  customDuration?: string
): string => {
  const [duration, setDuration] = useState<string>(() => {
    if (customDuration) return customDuration;
    if (!url) return "";
    return durationCache.get(url) || "";
  });

  // Listen for duration updates from Plyrio player
  useEffect(() => {
    if (customDuration) {
      setDuration(customDuration);
      return;
    }

    const handleUpdate: DurationListener = (updatedUrl, updatedDuration) => {
      if (updatedUrl === url && updatedDuration) {
        setDuration(updatedDuration);
      }
    };

    listeners.add(handleUpdate);

    if (url && durationCache.has(url)) {
      setDuration(durationCache.get(url)!);
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, [url, customDuration]);

  // For self-hosted media, probe metadata if not already cached
  useEffect(() => {
    if (customDuration || provider !== "library" || !url) return;

    if (durationCache.has(url)) {
      setDuration(durationCache.get(url)!);
      return;
    }

    let isMounted = true;
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;

    const onLoadedMetadata = () => {
      if (!isMounted) return;
      const formatted = formatDuration(tempVideo.duration);
      if (formatted) {
        setCachedDuration(url, formatted);
      }
      cleanup();
    };

    const onError = () => {
      if (!isMounted) return;
      cleanup();
    };

    const cleanup = () => {
      tempVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
      tempVideo.removeEventListener("error", onError);
      tempVideo.removeAttribute("src");
      tempVideo.load();
    };

    tempVideo.addEventListener("loadedmetadata", onLoadedMetadata);
    tempVideo.addEventListener("error", onError);

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [url, provider, customDuration]);

  return customDuration || duration;
};

export default useVideoDuration;
