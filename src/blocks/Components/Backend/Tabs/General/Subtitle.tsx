import { __ } from "@wordpress/i18n";
import { PanelBody, TextControl } from "@wordpress/components";
import { Captions } from "lucide-react";

import Title from "../Title";
import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components/MediaControl/MediaControl";
import type { BlockAttributes, SubtitleItem } from "../../../../types";

interface SubtitleProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

const Subtitle = ({ attributes, setAttributes }: SubtitleProps) => {
  const subtitles: SubtitleItem[] = Array.isArray(attributes.subtitle) ? attributes.subtitle : [];
  const currentSubtitle: SubtitleItem = subtitles[0] || { label: "English/en", caption_file: "" };
  const { label = "English/en", caption_file = "" } = currentSubtitle;

  const updateSubtitle = (updates: Partial<SubtitleItem>) => {
    const updated: SubtitleItem = {
      label: updates.label !== undefined ? updates.label : label,
      caption_file: updates.caption_file !== undefined ? updates.caption_file : caption_file,
    };

    if (!updated.caption_file && !updated.label) {
      setAttributes({ subtitle: [] });
    } else {
      setAttributes({ subtitle: [updated] });
    }
  };

  return (
    <PanelBody
      title={<Title title={__("Subtitle / Caption", "html5-video-player")} Icon={Captions} /> as unknown as string}
      initialOpen={false}
      className="bPlPanelBody"
    >
      <TextControl
        label={__("Language Label & Code", "html5-video-player")}
        value={label}
        placeholder="English/en"
        help={__("Format: Language/code (e.g. English/en)", "html5-video-player")}
        onChange={(newLabel: string) => updateSubtitle({ label: newLabel })}
      />

      <InlineMediaUpload
        types={["text/vtt", "text", "vtt"]}
        label={__("Caption File (.vtt)", "html5-video-player")}
        onChange={(newFile: string) => updateSubtitle({ caption_file: newFile })}
        value={caption_file}
        placeholder={__("Upload or paste .vtt URL", "html5-video-player")}
      />
    </PanelBody>
  );
};

export default Subtitle;
