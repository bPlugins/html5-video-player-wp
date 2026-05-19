import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { useSelect, dispatch } from "@wordpress/data";
import { Button, Placeholder } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";


import { cameraIcon } from "../constants";

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

  const allowedBlocks = [
    "html5-player/video",
    "html5-player/vimeo",
    "html5-player/youtube",
    "html5-player/popup-trigger",
  ];

  if (!innerBlocks?.length) {
    return (
      <div>
        <div {...blockProps}>
          <Placeholder
            icon={cameraIcon}
            instructions={__("Choose a video type to get started.", "h5vp")}
            label={__("Choose a Video Type", "h5vp")}
          >
            <Button variant="primary" onClick={() => insertBlockType("video")}>
              {__("Video", "h5vp")}
            </Button>
            <Button variant="primary" onClick={() => insertBlockType("youtube")}>
              {__("Youtube", "h5vp")}
            </Button>
            <Button variant="primary" onClick={() => insertBlockType("vimeo")}>
              {__("Vimeo", "h5vp")}
            </Button>
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
