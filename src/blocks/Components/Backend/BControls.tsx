import { PanelBody, ToggleControl } from "@wordpress/components";

import type { BlockAttributes } from "../../types";

interface ControlSetting {
  label: string;
  control: string;
}

interface BControlsProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
  updateOption: (value: Record<string, any>, type?: string | null) => void;
}

const controlSettings: ControlSetting[] = [
  { label: "Play Large", control: "play-large" },
  { label: "Restart", control: "restart" },
  { label: "Rewind", control: "rewind" },
  { label: "Play", control: "play" },
  { label: "Fast Forward", control: "fast-forward" },
  { label: "Progress", control: "progress" },
  { label: "Current Time", control: "current-time" },
  { label: "Duration", control: "duration" },
  { label: "Mute", control: "mute" },
  { label: "Volume", control: "volume" },
  { label: "PIP", control: "pip" },
  { label: "Airplay", control: "airplay" },
  { label: "Settings", control: "settings" },
  { label: "Download", control: "download" },
  { label: "Fullscreen", control: "fullscreen" },
];

const BControls = ({ attributes: { options, provider, presetId }, updateOption }: BControlsProps) => {
  const { controls } = options;

  const handleControl = (control: string) => {
    const originalControls = controlSettings.map((item) => item.control);
    let newControls: string[];
    if (controls.includes(control)) {
      newControls = controls.filter((item) => item !== control);
    } else {
      newControls = originalControls.filter((item) => controls.includes(item) || item === control);
    }
    updateOption({ controls: newControls });
  };

  if (presetId) {
    return (
      <PanelBody className="bPlPanelBody">
        <p>Update Controls From Preset</p>
      </PanelBody>
    );
  }

  return (
    <PanelBody className="bPlPanelBody">
      {controlSettings.map(({ label, control }) => {
        if (["youtube", "vimeo"].includes(provider) && ["download", "pip"].includes(control)) {
          return null;
        }
        return (
          <ToggleControl
            key={control}
            label={label}
            id={control}
            className="mb10"
            checked={controls.includes(control)}
            onChange={() => handleControl(control)}
          />
        );
      })}
    </PanelBody>
  );
};

export default BControls;
