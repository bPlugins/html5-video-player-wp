import { __ } from "@wordpress/i18n";
import { useBlockProps, BlockControls, MediaPlaceholder } from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";

import AudioInspectorControls from "./AudioInspectorControls";
import { AudioBlockAttributes } from "./types";
import AudioPlayer from "./player/AudioPlayer";


interface EditProps {
  attributes: AudioBlockAttributes;
  setAttributes: (attrs: Partial<AudioBlockAttributes>) => void;
}

const Edit = ({ attributes, setAttributes }: EditProps) => {
  const { source } = attributes;
  const blockProps = useBlockProps({ className: "html5-player-audio-block" });

  return (
    <div {...blockProps}>
      {source && (
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton icon="edit" label={__("Replace audio", "html5-video-player")} onClick={() => setAttributes({ source: "" })} />
          </ToolbarGroup>
        </BlockControls>
      )}
      {source ? (
        <>
          <AudioInspectorControls {...{ attributes, setAttributes }} />
          <div className="h5vp-audio-editor-preview">
            <AudioPlayer attributes={attributes} />
          </div>
        </>
      ) : (
        <MediaPlaceholder
          icon="format-audio"
          labels={{
            title: __("Audio Player", "html5-video-player"),
            instructions: __("Upload an audio file, pick one from the media library, or paste a URL.", "html5-video-player"),
          }}
          accept="audio/*"
          allowedTypes={["audio"]}
          //@ts-ignore
          onSelect={(media: { url: string }) => setAttributes({ source: media.url })}
          onSelectURL={(url: string) => setAttributes({ source: url })}
        />
      )}
    </div>
  );
};

export default Edit;
