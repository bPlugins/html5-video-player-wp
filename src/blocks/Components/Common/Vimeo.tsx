/**
 * Vimeo
 *
 * Renders a Vimeo embed wrapped in a Plyr‑compatible container.
 */

interface VimeoProps {
  source: string;
  className?: string;
  'data-poster'?: string;
}

const Vimeo = ({ source, className = '', ...props }: VimeoProps) => {
  const poster = props['data-poster'];

  const iframeSrc = source
    ? `${source}?loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`
    : '';

  return (
    <div className={`plyr__video-embed player_vimeo h5vp_player ${className}`} id="player" {...props}>
      <iframe
        src={iframeSrc}
        allowFullScreen
        allow="autoplay"
        title="Vimeo video player"
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

export default Vimeo;
