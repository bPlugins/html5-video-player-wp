import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { useSelect, dispatch } from "@wordpress/data";
import { Placeholder } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";


import { cameraIcon, youtubeIcon, vimeoIcon, audioIcon } from "../constants";

interface ParentEditProps {
  clientId: string;
  isSelected: boolean;
}

const Edit = ({ clientId, isSelected }: ParentEditProps) => {
  const blockProps = useBlockProps();
  const innerBlocks = useSelect(
    (select: any) => select("core/block-editor").getBlock(clientId).innerBlocks
  );

  useEffect(() => {
    if (isSelected) {

      (dispatch("core/edit-post") as any)?.openGeneralSidebar("edit-post/block");
    }
  }, [isSelected]);

  // Ensure template validity is not checked (can cause issues)
  dispatch("core/block-editor").setTemplateValidity(true);

  const insertBlockType = (type: string) => {
    const block = createBlock(`html5-player/${type}`);
    return dispatch("core/block-editor").insertBlock(block, 0, clientId);
  };

  const appenderToUse = () => {
    if (innerBlocks.length === 0) {
      return <InnerBlocks.ButtonBlockAppender />;
    }
    return false;
  };

  const playerTypes = [
    { type: "video", label: __("Video", "html5-video-player"), icon: cameraIcon },
    { type: "youtube", label: __("YouTube", "html5-video-player"), icon: youtubeIcon("30") },
    { type: "vimeo", label: __("Vimeo", "html5-video-player"), icon: vimeoIcon("30") },
    { type: "audio", label: __("Audio", "html5-video-player"), icon: audioIcon("30") },
  ];

  const allowedBlocks = [
    "html5-player/video",
    "html5-player/vimeo",
    "html5-player/youtube",
    "html5-player/popup-trigger",
    "html5-player/audio",
  ];

  if (!innerBlocks?.length) {
    return (
      <div>
        <div {...blockProps}>
          <Placeholder
            icon={cameraIcon}
            instructions={__("Choose a video type to get started.", "html5-video-player")}
            label={__("Choose a Video Type", "html5-video-player")}
            className="h5vp-parent-placeholder"
          >
            <div className="h5vp-type-grid">
              {playerTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  className="h5vp-type-card"
                  onClick={() => insertBlockType(type)}
                >
                  <span className="h5vp-type-card__icon">{icon}</span>
                  <span className="h5vp-type-card__label">{label}</span>
                </button>
              ))}
            </div>
          </Placeholder>
          <InnerBlocks
            templateLock={false}
            allowedBlocks={allowedBlocks}
            renderAppender={() => false}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div {...blockProps}>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={allowedBlocks}
          renderAppender={() => appenderToUse()}
        />
      </div>
    </div>
  );
};

export default Edit;
