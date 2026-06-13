import { useEffect, useState } from "react";
import { TextControl, SelectControl, PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import isYoutubeURL from "../../../../../../../wp-utils/v1/isYoutubeURL";
import Notice from "./../../../../../../../bpl-tools/Components/Notice";
import BToggleControl from "../../BToggleControl";
import { helpText } from "../../../../../utils/constant";
import SettingsIcon from "../../../../../icons/Settings";
import Title from "../Title";

import type { BlockAttributes } from "../../../../types";

interface SettingsProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
  handleOptions: (value: Record<string, any>, type?: string | null) => void;
  name?: string;
}

const Settings = ({ attributes, setAttributes, handleOptions }: SettingsProps) => {
  const { source, options, presetId } = attributes;
  const { autoplay, muted, hideControls, ratio, resetOnEnd, loop, speed } = options;

  const [isCustomRatio, setIsCustomRatio] = useState(false);

  useEffect(() => {
    if (isYoutubeURL(source)) {
      setAttributes({ library: "youtube" } as any);
    }
  }, [source]);


  return (
    <PanelBody title={<Title title={__("Settings", "h5vp")} Icon={SettingsIcon} /> as unknown as string} initialOpen={false} className="bPlPanelBody">
      <BToggleControl info={helpText.autoplay} help={autoplay ? __("muted should be enabled", "h5vp") : ""} label={__("Autoplay", "h5vp")} id="autoplay" checked={autoplay} onChange={() => handleOptions({ autoplay: !autoplay })} />

      <BToggleControl info={helpText.muted} label={__("Muted", "h5vp")} checked={muted} onChange={() => handleOptions({ muted: !muted })} />

      <BToggleControl info={helpText.repeat} label={__("Repeat", "h5vp")} checked={loop.active} onChange={() => handleOptions({ loop: { ...loop, active: !loop.active } })} />

      {!loop.active && !presetId && <BToggleControl info={helpText.resetOnEnd} label={__("Reset On End", "h5vp")} checked={resetOnEnd} onChange={() => handleOptions({ resetOnEnd: !resetOnEnd })} />}

      {!presetId && <BToggleControl info={helpText.autoHideControls} label={__("Auto Hide Control", "h5vp")} checked={hideControls} onChange={() => handleOptions({ hideControls: !hideControls })} />}

      <BToggleControl
        info={helpText.videoRatio}
        Component={SelectControl}
        labelPosition="top"
        value={isCustomRatio ? "custom" : ratio}
        label={__("Video Ratio (Aspect Ratio)", "h5vp")}
        options={[
          { label: "Original", value: "original" },
          { label: "Square (1:1)", value: "1:1" },
          { label: "Standard (4:3)", value: "4:3" },
          { label: "Widescreen (16:9)", value: "16:9" },
          { label: "Panoramic (21:9)", value: "21:9" },
          { label: "Portrait (3:4)", value: "3:4" },
          { label: "Classic (3:2)", value: "3:2" },
          { label: "Classic Portrait (2:3)", value: "2:3" },
          { label: "Tall (9:16)", value: "9:16" },
          { label: "Custom", value: "custom" },
        ]}
        onChange={(ratio: string) => {
          if (ratio === "custom") {
            setIsCustomRatio(true);
          } else {
            setIsCustomRatio(false);
            handleOptions({ ratio });
          }
        }}
      />

      {isCustomRatio && (
        <BToggleControl
          info={helpText.videoRatio}
          Component={TextControl}
          label={__("Custom Video Ratio", "h5vp")}
          help="Original - blank, Square - 1:1, Standard - 4:3, Portrait - 3:4, Classic - 3:2, Classic Portrait - 2:3, Wide - 16:9, Tall - 9:16"
          onChange={(ratio: string) => handleOptions({ ratio })}
          value={ratio}
          placeholder={"16:9"}
          autoComplete={false}
        />
      )}

      <BToggleControl
        info={__("The speed options to display in the UI. YouTube and Vimeo will ignore any options outside of the 0.5-2 range, so options outside of this range will be hidden automatically.", "h5vp")}
        Component={TextControl}
        label={__("Speed", "h5vp")}
        value={speed.options}
        onChange={(options: string) => handleOptions({ ...speed, options: options.split(",") }, "speed")}
      />

      <Notice status="premium" isIcon={true}>
        <h3>
          {__("Premium Features", "html5-video-player")}
        </h3>
        {/* write the pro feature list in this panel . ul li */}
        <ul>
          <li>{__("Autoplay when visible", "html5-video-player")}</li>
          <li>{__("Save playback state", "html5-video-player")}</li>
          <li>{__("Stick on scroll", "html5-video-player")}</li>
          <li>{__("Seektime", "html5-video-player")}</li>
          <li>{__("Preload", "html5-video-player")}</li>
          <li>{__("Start time", "html5-video-player")}</li>
          <li>{__("Custom play button", "html5-video-player")}</li>
          <li>{__("Ads", "html5-video-player")}</li>
          <li>{__("6 new player skin/theme", "html5-video-player")}</li>
        </ul>
      </Notice>

    </PanelBody>
  );
};

export default Settings;
