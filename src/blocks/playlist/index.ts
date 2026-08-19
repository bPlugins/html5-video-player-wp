import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./Edit";

registerBlockType(metadata.name, {
  ...(metadata as any),
  edit: Edit as any,
  save: () => null,
});
