import React from "react";
import { __ } from "@wordpress/i18n";
import {
  SelectControl,
  TextControl,
  TextareaControl,
} from "@wordpress/components";
import { InlineMediaUpload } from "../../../../../bpl-tools/Components/MediaControl/MediaControl";
import { PlaylistVideo, PlaylistProvider } from "../types";

interface VideoItemSettingsProps {
  video: PlaylistVideo;
  onChange: (updated: PlaylistVideo) => void;
}

const VideoItemSettings: React.FC<VideoItemSettingsProps> = ({
  video,
  onChange,
}) => {
  const provider = video.h5vp_video_provider || "library";
  const isLibrary = provider === "library";

  return (
    <div className="h5vp-video-item-settings">
      <SelectControl
        label={__("Provider", "html5-video-player")}
        value={provider}
        options={[
          { label: __("Library / CDN", "html5-video-player"), value: "library" },
          { label: __("YouTube", "html5-video-player"), value: "youtube" },
          { label: __("Vimeo", "html5-video-player"), value: "vimeo" },
        ]}
        onChange={(val) =>
          onChange({
            ...video,
            h5vp_video_provider: val as PlaylistProvider,
          })
        }
        className="mb5"
      />

      {isLibrary ? (
        <InlineMediaUpload
          types={["video"]}
          label={__("Video Source", "html5-video-player")}
          onChange={(source: string) => onChange({ ...video, video_source: source })}
          value={video.video_source || ""}
          placeholder={__("Select MP4 or paste HLS (.m3u8) URL", "html5-video-player")}
          className="mb5"
        />
      ) : (
        <TextControl
          label={
            provider === "youtube"
              ? __("YouTube URL", "html5-video-player")
              : __("Vimeo URL", "html5-video-player")
          }
          value={video.h5vp_video_source || ""}
          placeholder="https://"
          onChange={(val) => onChange({ ...video, h5vp_video_source: val })}
          className="mb5"
        />
      )}

      <InlineMediaUpload
        types={["image"]}
        label={__("Thumbnail", "html5-video-player")}
        onChange={(thumb: string) => onChange({ ...video, video_thumb: thumb })}
        value={video.video_thumb || ""}
        placeholder="https://"
        className="mb5"
      />

      <TextControl
        label={__("Title", "html5-video-player")}
        className="mb5"
        value={video.video_title || ""}
        placeholder={__("Video Title", "html5-video-player")}
        onChange={(val) => onChange({ ...video, video_title: val })}
      />

    </div>
  );
};

export default VideoItemSettings;
