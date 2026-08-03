import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import { Button, Placeholder } from "@wordpress/components";
import { useBlockProps, MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { dispatch } from "@wordpress/data";

import BSettings from "./BSettings";
import VideoPlayer from "../Common/VideoPlayer";
import { cameraIcon } from "../../constants";
import type { EditProps, ProviderConfig } from "../../types";

interface EditBlockProps extends EditProps {
  config: ProviderConfig;
}

const EditBlock = ({ config, ...props }: EditBlockProps) => {
  const { validator, hasMediaUpload = false, placeholderText, blockName = 'video', icon = cameraIcon } = config;
  const { attributes, setAttributes, isSelected, clientId } = props;

  const { source } = attributes;

  const [mediaSource, setMediaSource] = useState<string | undefined>();
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (isSelected) {
      (dispatch("core/edit-post") as any)?.openGeneralSidebar("edit-post/block");
    }
  }, [isSelected]);



  const handleApply = (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    if (!validator(mediaSource)) {
      setValid(false);
      return false;
    }
    setValid(true);
    setAttributes({ source: mediaSource });
    setMediaSource("");
  };

  return (
    <>
      <div {...useBlockProps()}>
        {!isSelected && <div className="item_selected"></div>}
        {source ? (
          <>
            <div className="h5vp_player_overlay"></div>
            <BSettings {...props} />
            <VideoPlayer
              attributes={attributes}
              isBackend={true}
              clientId={clientId}
            />
          </>
        ) : (
          <Placeholder
            icon={icon}
            instructions={["youtube", "vimeo"].includes(blockName) ? `Paste or type a ${blockName} video URL/ID` : __("Upload a video or paste/write a video URL to get started.", "h5vp")}
            label={["youtube", "vimeo"].includes(blockName) ? blockName.toUpperCase() : __("Upload a Video ", "h5vp")}
          >
            {hasMediaUpload && (
              <MediaUploadCheck>
                <MediaUpload
                  allowedTypes={["video"]}
                  //@ts-ignore
                  onSelect={(media: { url: string }) => setAttributes({ source: media.url })}
                  render={({ open }: { open: () => void }) => (
                    <Button variant="primary" onClick={open}>
                      {__("Upload", "h5vp")}
                    </Button>
                  )}
                />
              </MediaUploadCheck>
            )}
            <div className="h5vpUrlInput">
              {hasMediaUpload && <h3 style={{ fontSize: "15px" }}> Or </h3>}
              <input
                type="url"
                aria-label={__("URL", "h5vp")}
                placeholder={placeholderText ?? __("Paste or type a video URL", "h5vp")}
                onChange={(src) => {
                  setValid(true);
                  setMediaSource(src.target.value);
                }}
                value={mediaSource}
              />
              <Button label={__("Apply", "h5vp")} type="submit" onClick={handleApply} isPrimary>
                {__("Apply", "h5vp")}
              </Button>
            </div>
            {!valid && (
              <p style={{ color: "#bd1818", width: "100%", margin: 0 }}>
                {__("URL is not valid", "h5vp")}
              </p>
            )}
          </Placeholder>
        )}
      </div>
    </>
  );
};

export default EditBlock;
