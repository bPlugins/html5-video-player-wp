import React from "react";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, TextControl } from "@wordpress/components";
import ItemsPanel from "../../../../../bpl-tools/Components/ItemsPanel/ItemsPanel";
import {
  PlaylistBlockAttributes,
  PlaylistVideo,
  EMPTY_VIDEO,
} from "../types";
import VideoItemSettings from "./VideoItemSettings";
import CopyShortcode from "../../Components/Backend/CopyShortcode";

interface InspectorProps {
  attributes: PlaylistBlockAttributes;
  setAttributes: (attrs: Partial<PlaylistBlockAttributes>) => void;
}

interface ItemSettingsProps {
  attributes?: PlaylistBlockAttributes;
  setAttributes?: (attrs: Partial<PlaylistBlockAttributes>) => void;
  arrKey?: string;
  index: number;
}

// Stable component reference outside Inspector to prevent losing input focus on keystroke
const PlaylistItemSettings: React.FC<ItemSettingsProps> = ({
  attributes,
  setAttributes,
  arrKey = "videos",
  index,
}) => {
  const videos: PlaylistVideo[] = (attributes as any)?.[arrKey] || [];
  const video = videos[index] || EMPTY_VIDEO;

  const handleChange = (updated: PlaylistVideo) => {
    const newVideos = [...videos];
    newVideos[index] = updated;
    setAttributes?.({ [arrKey]: newVideos });
  };

  return <VideoItemSettings video={video} onChange={handleChange} />;
};

const Inspector: React.FC<InspectorProps> = ({
  attributes,
  setAttributes,
}) => {
  const {
    videos = [],
    autoplayNextVideo = true,
    playerWidth = "100%",
  } = attributes;

  return (
    <InspectorControls>
      <CopyShortcode />
      {/* ── 1. Videos Repeater using bpl-tools ItemsPanel in PanelBody ─ */}
      <PanelBody
        title={`${__("Videos", "html5-video-player")} (${videos.length})`}
        initialOpen={true}
        className="bPlPanelBody"
      >
        <ItemsPanel
          attributes={attributes}
          setAttributes={setAttributes}
          arrKey="videos"
          newItem={EMPTY_VIDEO}
          design="sortable"
          itemLabel={__("Video", "html5-video-player")}
          title="video_title"
          ItemSettings={PlaylistItemSettings}
        />
      </PanelBody>

      {/* ── 2. Playlist Settings ───────────────────────────────── */}
      <PanelBody
        title={__("Playlist Settings", "html5-video-player")}
        initialOpen={true}
      >
        <ToggleControl
          label={__("Auto Play Next Video", "html5-video-player")}
          checked={autoplayNextVideo}
          onChange={(val) => setAttributes({ autoplayNextVideo: val })}
          help={__(
            "Automatically play the next video with a 5s countdown when current video ends.",
            "html5-video-player"
          )}
        />

        <TextControl
          label={__("Player Width", "html5-video-player")}
          value={playerWidth}
          onChange={(val) => setAttributes({ playerWidth: val })}
          placeholder="100%"
          help={__(
            "Set container width (e.g. 100%, 800px).",
            "html5-video-player"
          )}
        />
      </PanelBody>
    </InspectorControls>
  );
};

export default Inspector;
