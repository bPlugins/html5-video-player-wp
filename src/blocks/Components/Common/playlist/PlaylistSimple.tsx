import React from "react";
import { PlaylistVideo } from "src/blocks/playlist/types";
import PlaylistItem from "./PlaylistItem";

interface PlaylistSimpleProps {
  videos: PlaylistVideo[];
  currentIndex: number;
  isPlaying: boolean;
  onSelectVideo: (index: number) => void;
  onTogglePlay: () => void;
}

const PlaylistSimple: React.FC<PlaylistSimpleProps> = ({
  videos,
  currentIndex,
  isPlaying,
  onSelectVideo,
  onTogglePlay,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      if (currentIndex < videos.length - 1) {
        onSelectVideo(currentIndex + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentIndex > 0) {
        onSelectVideo(currentIndex - 1);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      onSelectVideo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onSelectVideo(videos.length - 1);
    }
  };

  return (
    <ul
      className="video__top h5vp_playlist_items simplelist"
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Playlist Videos"
    >
      {videos.map((video, index) => (
        <PlaylistItem
          key={index}
          video={video}
          index={index}
          isActive={index === currentIndex}
          isPlaying={isPlaying}
          onSelect={onSelectVideo}
          onTogglePlay={onTogglePlay}
        />
      ))}
    </ul>
  );
};

export default PlaylistSimple;
