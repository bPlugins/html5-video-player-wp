import EditBlock from "../Components/Backend/EditBlock";
import isYoutubeURL from "../../../../wp-utils/v1/isYoutubeURL";
import type { EditProps } from "../types";
import { youtubeIcon } from "../constants";

const Edit = (props: EditProps) => (
  <EditBlock
    config={{
      validator: isYoutubeURL,
      placeholderText: "Paste or type a youtube video URL",
      blockName: 'youtube',
      icon: youtubeIcon()
    }}
    {...props}
  />
);

export default Edit;
