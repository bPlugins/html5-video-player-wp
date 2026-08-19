import EditBlock from "../Components/Backend/EditBlock";
import isVimeoLink from "../../utils/isVimeoLink";
import type { EditProps } from "../types";
import { vimeoIcon } from "../constants";

const Edit = (props: EditProps) => (
  <EditBlock
    config={{
      validator: (source) => Boolean(isVimeoLink(source)),
      placeholderText: "Paste or type a vimeo video URL/ID",
      blockName: 'vimeo',
      icon: vimeoIcon()
    }}
    {...props}
  />
);

export default Edit;
