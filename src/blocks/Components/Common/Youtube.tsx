/**
 * Youtube
 *
 * Renders a YouTube embed wrapped in a Plyr‑compatible container.
 */

interface YoutubeProps {
  source: string;
  className?: string;
  'data-poster'?: string;
}

const Youtube = ({ source, className = '', ...props }: YoutubeProps) => {
  const poster = props['data-poster'];

  const iframeSrc = source
    ? `${source}?origin=${window.location.origin}&iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`
    : '';

  return (
    <div className={`plyr__video-embed player_youtube h5vp_player ${className}`} id="player" {...props}>
      <iframe
        src={iframeSrc}
        allowFullScreen
        allow="autoplay"
        title="YouTube video player"
      />

      {poster && (
        <div
          className="preload_poster"
          style={{ background: `url(${poster})` }}
        />
      )}
    </div>
  );
};

export default Youtube;
