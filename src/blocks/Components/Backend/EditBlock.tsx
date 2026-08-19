import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import { Button, Placeholder } from "@wordpress/components";
import { useBlockProps, MediaPlaceholder } from "@wordpress/block-editor";
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



  const handleSelectURL = (url: string) => {
    if (!validator(url)) {
      setValid(false);
      return;
    }
    setValid(true);
    setAttributes({ source: url });
  };

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
      {/* Mirror the frontend wrapper class that render.php emits so editor and
          frontend share one set of styles — the alignment rules hang off it. */}
      <div {...useBlockProps({ className: "html5_video_players" })}>
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
          hasMediaUpload ? (
            <MediaPlaceholder
              icon={icon}
              labels={{
                title: __("Video Player", "html5-video-player"),
                instructions: __("Upload a video, pick one from the media library, or paste a URL.", "html5-video-player"),
              }}
              accept="video/*"
              allowedTypes={["video"]}
              //@ts-ignore
              onSelect={(media: { url: string }) => {
                setValid(true);
                setAttributes({ source: media.url });
              }}
              onSelectURL={handleSelectURL}
              notices={
                !valid ? (
                  <p style={{ color: "#bd1818", width: "100%", margin: 0 }}>
                    {__("URL is not valid", "html5-video-player")}
                  </p>
                ) : undefined
              }
            />
          ) : (
            <Placeholder
              icon={icon}
              instructions={`Paste or type a ${blockName} video URL/ID`}
              label={blockName.toUpperCase()}
            >
              <div className="h5vpUrlInput">
                <input
                  type="url"
                  aria-label={__("URL", "html5-video-player")}
                  placeholder={placeholderText ?? __("Paste or type a video URL", "html5-video-player")}
                  onChange={(src) => {
                    setValid(true);
                    setMediaSource(src.target.value);
                  }}
                  value={mediaSource}
                />
                <Button label={__("Apply", "html5-video-player")} type="submit" onClick={handleApply} isPrimary>
                  {__("Apply", "html5-video-player")}
                </Button>
              </div>
              {!valid && (
                <p style={{ color: "#bd1818", width: "100%", margin: 0 }}>
                  {__("URL is not valid", "html5-video-player")}
                </p>
              )}
            </Placeholder>
          )
        )}
      </div>
    </>
  );
};

export default EditBlock;
