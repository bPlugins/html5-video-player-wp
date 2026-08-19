//@ts-nocheck
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";

import Edit from "./Edit";
import metadata from "./block.json";
import "./editor.scss";

registerBlockType(metadata as any, {
  edit: Edit,

  save: () => {
    const blockProps = useBlockProps.save();
    return (
      <div {...blockProps}>
        <InnerBlocks.Content />
      </div>
    );
  },
});
