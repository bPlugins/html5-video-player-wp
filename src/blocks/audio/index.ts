import { registerBlockType } from "@wordpress/blocks";

import Edit from "./Edit";
import metadata from "./block.json";
import "./editor.scss";


registerBlockType(metadata as any, {
  edit: Edit as any,
  save: () => null,
});
