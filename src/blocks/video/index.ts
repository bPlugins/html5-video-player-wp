import { registerBlockType } from "@wordpress/blocks";

import Edit from "./Edit";
import metadata from "./block.json";

import "./../dashboard.common.scss";
import "./../Components/style.scss";

registerBlockType(metadata as any, {
  edit: Edit as any,
  save: () => null,
});
