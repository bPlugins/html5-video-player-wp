import { registerBlockType } from "@wordpress/blocks";

import Edit from "./Edit";
import metadata from "./block.json";
import { youtubeIcon } from "../constants";

registerBlockType(metadata as any, {
  icon: youtubeIcon() as any,
  edit: Edit as any,
  save: () => null,
  example: {
    attributes: {} as any,
  },
});


