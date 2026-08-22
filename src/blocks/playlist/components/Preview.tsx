import React, { useState } from "react";
import { PlaylistBlockAttributes } from "../types";
import { useVideoDuration } from "../../Components/Common/playlist/useVideoDuration";

interface PreviewProps {
  attributes: PlaylistBlockAttributes;
}

const PreviewItem: React.FC<{
  video: any;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}> = ({ video, index, isActive, onSelect }) => {
  const isLibrary = video.h5vp_video_provider === "library";
  const sourceUrl = isLibrary ? video.video_source : video.h5vp_video_source;
  const duration = useVideoDuration(
    sourceUrl,
    video.h5vp_video_provider,
    video.video_duration
  );

  return (
    <li
      className={`h5vp_playlist_item ${isActive ? "active" : ""}`}
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
    >
      <div className="svg play_pause_svg">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      </div>

      <div className="video_title">
        <span className="title">
          {video.video_title || `Video ${index + 1}`}
        </span>
      </div>

      {duration && (
        <span className="h5vp_playlist_badge h5vp_playlist_badge--duration">
          {duration}
        </span>
      )}
    </li>
  );
};

const Preview: React.FC<PreviewProps> = ({ attributes }) => {
  const { videos = [], playerWidth = "100%", uniqueId } = attributes;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const brandColor: string | undefined = window.h5vpBlock?.brandColor;

  const activeVideo = videos[selectedIndex] || videos[0];
  const poster = activeVideo?.video_thumb || "";

  return (
    <div
      id={uniqueId}
      className="h5vp_playlist video video--bg simplelist h5vp-editor-preview"
      style={
        brandColor
          ? ({ "--h5vp-accent": brandColor } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className="h5vp_playlist_container"
        style={{ width: playerWidth, maxWidth: "100%" }}
      >
        <div
          className="video__wrapper"
          style={{
            aspectRatio: "16/9",
            backgroundImage: poster ? `url(${poster})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
          }}
        >
          <div className="h5vp-preview-play-btn">
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="#ffffff"
            >
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </div>
        </div>

        <ul className="video__top h5vp_playlist_items simplelist">
          {videos.map((video, index) => (
            <PreviewItem
              key={index}
              video={video}
              index={index}
              isActive={index === selectedIndex}
              onSelect={setSelectedIndex}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Preview;
