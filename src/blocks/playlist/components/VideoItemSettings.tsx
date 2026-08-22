import React from "react";
import { __ } from "@wordpress/i18n";
import {
  SelectControl,
  TextControl,
} from "@wordpress/components";
import { InlineMediaUpload } from "../../../../../bpl-tools/Components/MediaControl/MediaControl";
import isYoutubeURL from "../../../../../wp-utils/v1/isYoutubeURL";
import isVimeoLink from "../../../utils/isVimeoLink";
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
  const currentSource = (video.h5vp_video_source || "").trim();
  const sourceLooksMismatched =
    !isLibrary &&
    !!currentSource &&
    (provider === "youtube" ? !isYoutubeURL(currentSource) : !isVimeoLink(currentSource));

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
        onChange={(val) => {
          // Switching provider must never discard an already-stored URL — it
          // may simply be a format our validators don't recognize yet.
          onChange({
            ...video,
            h5vp_video_provider: val as PlaylistProvider,
          });
        }}
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
          help={
            sourceLooksMismatched ? (
              <span className="h5vp-field-warning">
                <span className="dashicons dashicons-warning" aria-hidden="true" />
                {__("This does not look like a valid URL or ID for the selected provider.", "html5-video-player")}
              </span>
            ) : undefined
          }
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

      <TextControl
        label={__("Duration (Optional)", "html5-video-player")}
        className="mb5"
        value={video.video_duration || ""}
        placeholder={__("e.g. 3:45", "html5-video-player")}
        help={__(
          "Auto-detected, You can also specify custom duration.",
          "html5-video-player"
        )}
        onChange={(val) => onChange({ ...video, video_duration: val })}
      />

    </div>
  );
};

export default VideoItemSettings;
