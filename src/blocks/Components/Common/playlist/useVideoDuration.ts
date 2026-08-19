import { useState, useEffect } from "react";
import { PlaylistProvider } from "src/blocks/playlist/types";

const durationCache = new Map<string, string>();

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
 * Probes video duration for self-hosted/library media URLs.
 */
export const useVideoDuration = (
  url?: string,
  provider?: PlaylistProvider
): string => {
  const [duration, setDuration] = useState<string>(() => {
    if (!url || provider === "youtube" || provider === "vimeo") return "";
    return durationCache.get(url) || "";
  });

  useEffect(() => {
    if (!url || provider === "youtube" || provider === "vimeo") {
      setDuration("");
      return;
    }

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
        durationCache.set(url, formatted);
        setDuration(formatted);
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
  }, [url, provider]);

  return duration;
};

export default useVideoDuration;
