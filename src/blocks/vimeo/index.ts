import { registerBlockType } from "@wordpress/blocks";

import Edit from "./Edit";
import metadata from "./block.json";
import { vimeoIcon } from "../constants";


registerBlockType(metadata as any, {
  icon: vimeoIcon(),
  edit: Edit as any,
  save: () => null,
});

