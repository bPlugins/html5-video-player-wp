// eslint-disable-next-line no-unused-vars
import { version } from "react-dom"; // don't remove it, to add react-dom as dependency on view.asset.php, this line is crucial

import VideoPlayer from "./Components/Common/VideoPlayer";

//@ts-ignore
const { createRoot } = window.ReactDOM;

document.addEventListener("DOMContentLoaded", function () {
  const blocks = document.querySelectorAll('[class^="wp-block-html5-player-"]');

  blocks.forEach((block) => {
    const el = block as HTMLElement;
    if (!el.dataset.attributes) return;
    const attributers = JSON.parse(el.dataset.attributes);
    const nonce = el.dataset.nonce;
    createRoot(el).render(<VideoPlayer attributes={attributers} nonce={nonce} />);

    el.removeAttribute("data-attributes");
    el.removeAttribute("data-nonce");
  });
});

window.addEventListener("elementor/frontend/init", function () {
  (window as any).elementorFrontend.hooks.addAction(
    "frontend/element_ready/H5VPPlayer.default",
    function (scope: any) {
      // the player in the editor preview.
      const block = scope?.[0]?.querySelector(".html5_video_players") as HTMLElement | null;
      if (!block || !block.dataset.attributes) return;

      const attributers = JSON.parse(block.dataset.attributes);
      const nonce = block.dataset.nonce;

      block.removeAttribute("data-attributes");
      block.removeAttribute("data-nonce");

      createRoot(block).render(<VideoPlayer attributes={attributers} nonce={nonce} />);
    }
  );
});
