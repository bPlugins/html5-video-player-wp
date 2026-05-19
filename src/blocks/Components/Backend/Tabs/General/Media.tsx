import { __ } from "@wordpress/i18n";
import { PanelBody, TextControl } from "@wordpress/components";

import { InlineMediaUpload, Notice } from "./../../../../../../../bpl-tools/Components";
import CustomPanelBody from "../../CustomPanelBody";
import BToggleControl from "../../BToggleControl";

import type { BlockAttributes } from "../../../../types";
import { videoIcon2 } from "src/icons/VideoIcon";

interface MediaProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

const Media = ({ attributes, setAttributes }: MediaProps) => {
  const { source, poster, provider } = attributes;
  return (
    <PanelBody title={<div className="h5vp-panel-icon">{videoIcon2({ color: "#146ef5" })} {" "}{__("Media", "html5-video-player")} </div> as unknown as string} initialOpen={false} >
      <InlineMediaUpload types={["video"]} label={provider === "self-hosted" ? __("Video Source (720 recomended)", "html5-video-player") : __("Video Source", "html5-video-player")} onChange={(source: string) => setAttributes({ source })} value={source} placeholder="video source" />

      <BToggleControl
        info={__("Set an image to display before the video starts playing.", "html5-video-player")}
        Component={InlineMediaUpload}
        types={["image"]}
        label={__("Video Thumbnail", "html5-video-player")}
        onChange={(poster: string) => setAttributes({ poster })}
        value={poster}
        placeholder="video Thumbnails"
        help={__("thumbnail will show on frontend", "html5-video-player")}
      />

      <Notice isIcon={true} status="premium">{__("Set custom download URL is available in premium version", 'html5-video-player')}</Notice>

    </PanelBody>
  );
};

export default Media;
