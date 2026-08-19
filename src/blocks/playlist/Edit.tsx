import React, { useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { Placeholder, Button } from "@wordpress/components";
import { PlaylistBlockAttributes, EMPTY_VIDEO } from "./types";
import Inspector from "./components/Inspector";
import Preview from "./components/Preview";
import "./editor.scss";
import "src/playlist.scss";

interface EditProps {
  attributes: PlaylistBlockAttributes;
  setAttributes: (attrs: Partial<PlaylistBlockAttributes>) => void;
  clientId: string;
}

const Edit: React.FC<EditProps> = ({
  attributes,
  setAttributes,
  clientId,
}) => {
  const blockProps = useBlockProps();
  const { uniqueId, videos = [] } = attributes;

  useEffect(() => {
    if (!uniqueId && clientId) {
      const generatedId = `h5vp_playlist_${clientId.replace(/-/g, "").slice(0, 12)}`;
      setAttributes({ uniqueId: generatedId });
    }
  }, [clientId, uniqueId]);

  const handleAddVideo = () => {
    setAttributes({
      videos: [
        {
          ...EMPTY_VIDEO,
          video_title: `${__("Video", "html5-video-player")} 1`,
        },
      ],
    });
  };

  return (
    <div {...blockProps}>
      <Inspector
        attributes={attributes}
        setAttributes={setAttributes}
      />

      {videos.length === 0 ? (
        <Placeholder
          icon="playlist-video"
          label={__("HTML5 Video Player Playlist", "html5-video-player")}
          instructions={__(
            "Build a video playlist with multiple videos and simple list layout.",
            "html5-video-player"
          )}
        >
          <Button
            variant="primary"
            onClick={handleAddVideo}
          >
            {__("Add Video", "html5-video-player")}
          </Button>
        </Placeholder>
      ) : (
        <Preview attributes={attributes} />
      )}
    </div>
  );
};

export default Edit;
