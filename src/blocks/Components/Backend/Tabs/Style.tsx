import { __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import CustomPanelBody from "../CustomPanelBody";

import type { BlockAttributes } from "../../../types";

interface StyleProps {
  attributes: BlockAttributes;
  updateFeatures: (value: Record<string, any>, type?: string | null) => void;
  panelRef: React.RefObject<HTMLDivElement>;
  updateHandler: (value: Record<string, any>, type: string | null, attr: string) => void;
}

const Style = ({ attributes, updateFeatures, panelRef, updateHandler }: StyleProps) => {
  const { styles, presetId } = attributes;
  const { plyr_wrapper } = styles;


  const updateStyle = (value: Record<string, any>, styleType: string | null = null) => {
    updateHandler(value, styleType, "styles");
  };

  const handleUnitChange = (unit?: string) => {
    if (!unit) {
      updateStyle({ width: "100%" }, "plyr_wrapper");
      return;
    }
    if (unit === "%" || unit === "px") {
      updateStyle({ width: "100%" }, "plyr_wrapper");
    }
    if (unit === "px") {
      updateStyle({ width: "500px" }, "plyr_wrapper");
    }
    if (["rem", "vh", "hw"].includes(unit)) {
      updateStyle({ width: 100 + unit }, "plyr_wrapper");
    }
  };

  return (
    <CustomPanelBody title={__("Style", "html5-video-player")} badgeText={null} initialOpen={true} ref={panelRef}>
      <UnitControl
        label={__("Width", "html5-video-player")}
        step={1}
        value={plyr_wrapper.width}
        onChange={(width?: string) => updateStyle({ width }, "plyr_wrapper")}
        isResetValueOnUnitChange={true}
        onUnitChange={handleUnitChange}
      />
      <p></p>
      {!presetId && (
        <UnitControl
          label={__("Round Corner", "html5-video-player")}
          value={plyr_wrapper.borderRadius}
          onChange={(borderRadius?: string) => updateStyle({ borderRadius }, "plyr_wrapper")}
        />
      )}
    </CustomPanelBody>
  );
};

export default Style;
