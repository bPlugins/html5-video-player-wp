import { useState, useEffect } from 'react';
import isYoutubeURL from '../../../wp-utils/v1/isYoutubeURL';
import isVimeoLink from '../utils/isVimeoLink';

type VideoSourceType = 'youtube' | 'vimeo' | 'self-hosted' | 'amazons3';

interface UseVideoSourceOptions {
    source: string;
    provider?: string;
    uniqueId: string;
    streaming?: boolean;
    passwordProtected?: { enabled: boolean };

}

interface UseVideoSourceReturn {
    src: string;
    setSrc: React.Dispatch<React.SetStateAction<string>>;
    videoSource: VideoSourceType;
    setVideoSource: React.Dispatch<React.SetStateAction<VideoSourceType>>;
}

/**
 * Consolidates video-source logic:
 *  - Provider detection (YouTube / Vimeo / self-hosted)
 *  - XOR decoding when streaming is enabled
 *  - Password-protected blank-source handling
 */
const useVideoSource = ({
    source,
    provider,
    uniqueId,
    streaming,
    passwordProtected,
}: UseVideoSourceOptions): UseVideoSourceReturn => {
    const isPasswordProtected = passwordProtected?.enabled ?? false;


    const detectProvider = (raw: string): VideoSourceType => {
        if (provider && provider !== 'library') return provider as VideoSourceType;
        if (provider === 'library') return 'self-hosted';
        if (isYoutubeURL(raw)) return 'youtube';
        if (isVimeoLink(raw)) return 'vimeo';
        return 'self-hosted';
    };

    const [src, setSrc] = useState(() => source);
    const [videoSource, setVideoSource] = useState<VideoSourceType>(() => detectProvider(source));

    // Re-decode when the raw source changes


    // Re-detect provider only when no explicit provider is set
    useEffect(() => {
        if (!provider) {
            setVideoSource(detectProvider(source));
        }
    }, [source]);

    return { src, setSrc, videoSource, setVideoSource };
};

export default useVideoSource;
