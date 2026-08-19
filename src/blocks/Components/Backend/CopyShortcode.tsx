import { Button, Flex } from "@wordpress/components";
import { useState } from "react";
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";

const CopyShortcode = () => {
  const [copied, setCopied] = useState(false);
  const postType = select("core/editor")?.getCurrentPostType();
  const postId = select("core/editor")?.getCurrentPostId();

  const shortcode = `[html5_video id="${postId}"]`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = shortcode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {postType === "videoplayer" && (
        <Flex justify="center" align="center" className="mb10">
          <Button title={copied ? __("Copied", "html5-video-player") : ""} variant="primary" onClick={onCopy}>
            {copied ? __("Copied", "html5-video-player") : __("Copy Shortcode", "html5-video-player")}
          </Button>
        </Flex>
      )}
    </>
  );
};

export default CopyShortcode;
