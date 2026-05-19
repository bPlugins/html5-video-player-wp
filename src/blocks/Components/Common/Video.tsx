import { QualityItem, CaptionItem } from '../../../interfaces/MyPlayerInterface';

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────

interface VideoProps {
  poster: string;
  source: string;

  className?: string;
  reference?: React.Ref<HTMLVideoElement>;
  qualities?: QualityItem[];
  captions?: CaptionItem[];
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: string;
  playsInline?: boolean;
  'data-poster'?: string;
  style?: React.CSSProperties;
  src?: string;
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

const Video = ({
  poster,
  source,
  className = '',
  reference,
  qualities,
  captions,
  'data-poster': dataPoster,
  ...props
}: VideoProps) => (
  <>
    {/* crossOrigin attr should not use */}
    <video
      className={`h5vp_player ${className}`}
      id="player"
      data-poster={poster || ''}
      ref={reference}
      style={{ width: '100%', maxWidth: '100%', aspectRatio: '16/9' }}
      {...props}
    >
      {source && <source src={source} type="video/mp4" />
      }
    </video>

    {dataPoster && (
      <div
        className="preload_poster"
        style={{ background: `url(${dataPoster})` }}
      />
    )}
  </>
);

export default Video;
