import { __ } from "@wordpress/i18n";
import { PlaylistVideo } from "src/blocks/playlist/types";

interface UpNextCountdownProps {
  nextVideo: PlaylistVideo;
  secondsRemaining: number;
  onCancel: () => void;
  onPlayNow: () => void;
}

const UpNextCountdown = ({
  nextVideo,
  secondsRemaining,
  onCancel,
  onPlayNow,
}: UpNextCountdownProps) => {
  return (
    <div className="h5vp_upnext_overlay">
      <div className="h5vp_upnext_card">
        <div className="h5vp_upnext_header">
          <span className="h5vp_upnext_label">
            {__("Up Next in", "html5-video-player")} {secondsRemaining}s
          </span>
        </div>
        {nextVideo?.video_title && (
          <h4 className="h5vp_upnext_title">{nextVideo.video_title}</h4>
        )}
        <div className="h5vp_upnext_actions">
          <button
            type="button"
            className="h5vp_upnext_btn h5vp_upnext_btn--cancel"
            onClick={onCancel}
          >
            {__("Cancel", "html5-video-player")}
          </button>
          <button
            type="button"
            className="h5vp_upnext_btn h5vp_upnext_btn--play"
            onClick={onPlayNow}
          >
            {__("Play Now", "html5-video-player")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpNextCountdown;
