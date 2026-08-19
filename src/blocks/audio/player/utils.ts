/**
 * Derives a display title from a media URL: last path segment, query string and
 * extension removed. Used as the podcast skin's fallback when no title is set.
 */
export const getFileName = (url: string) => {
    if (!url) return "";
    try {
        const parts = url.split("/");
        const lastPart = parts[parts.length - 1] || "";
        const clean = decodeURIComponent(lastPart.split("?")[0]);
        return clean.replace(/\.[^/.]+$/, "");
    } catch {
        return "";
    }
};
