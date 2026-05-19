import { useEffect } from "react";
import { produce } from "immer";

import type { BlockAttributes } from "../../types";

interface RefactorDataStructureProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

const RefactorDataStructure = ({ setAttributes, attributes }: RefactorDataStructureProps) => {
  const { autoplay, autoHideControl, muted, options, preload, resetOnEnd, ratio, repeat, radius, styles, seekTime, speed, width, chapters, imported, controls } = attributes as any;
  const { playinline } = attributes as any;

  const handleStyles = () => {
    let newStyles = {};
    if (!width.isDeprecated) {
      newStyles = produce(styles, (draft: any) => {
        draft.plyr_wrapper = {
          width: width.number + width.unit,
        };
        draft.plyr = {
          borderRadius: radius.number + radius.unit,
        };
      });
    }
    return newStyles;
  };

  const handleOptions = () => {
    const newOptions = produce(options, (draft: any) => {
      draft.preload = preload;
      draft.controls = Object.keys(controls).filter((key: string) => controls[key]);
      draft.autoplay = autoplay;
      draft.playsinline = playinline;
      draft.seekTime = seekTime;
      draft.muted = muted;
      draft.ratio = ratio;
      draft.resetOnEnd = resetOnEnd;
      draft.hideControls = autoHideControl;
      draft.imported = true;
    });
    return newOptions;
  };

  useEffect(() => {
    if (!imported) {
      setAttributes({ styles: { ...styles, ...handleStyles() }, width: { ...width, isDeprecated: true }, options: handleOptions(), imported: true } as any);
    }
  }, []);

  return null;
};

export default RefactorDataStructure;
