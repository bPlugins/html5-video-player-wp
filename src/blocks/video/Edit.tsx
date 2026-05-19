import EditBlock from "../Components/Backend/EditBlock";
import type { EditProps } from "../types";

const validURL = (str: string | undefined): boolean => {
  if (!str) return false;
  return /https?/i.test(str);
};

const Edit = (props: EditProps) => (
  <EditBlock
    config={{
      validator: validURL,
      hasMediaUpload: true,
      placeholderText: "Paste or type a video URL",
    }}
    {...props}
  />
);

export default Edit;
