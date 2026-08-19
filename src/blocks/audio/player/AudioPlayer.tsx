import React from "react";
import { AudioBlockAttributes } from "../types";
import SkinDefault from "./SkinDefault";
import SkinMinimal from "./SkinMinimal";
import SkinPodcast from "./SkinPodcast";
import SkinCompact from "./SkinCompact";
import "../style.scss";

const AudioPlayer = ({ attributes }: { attributes: AudioBlockAttributes }) => {
    const {
        skin = "default",
        source,
        width,
        borderRadius,
        backgroundColor,
        primaryColor,
        textColor
    } = attributes;

    const brandColor = primaryColor || window.h5vpAudioBlock?.brandColor || "#005aff";

    const customStyles: React.CSSProperties = {
        ...(width ? { width, maxWidth: "100%" } : {}),
        ...(borderRadius ? { "--h5vp-audio-radius": borderRadius } : {}),
        "--h5vp-audio-primary": brandColor,
        ...(backgroundColor ? { "--h5vp-audio-bg": backgroundColor } : {}),
        ...(textColor ? { "--h5vp-audio-text": textColor, color: textColor } : {})
    } as React.CSSProperties;

    const renderSkin = () => {
        switch (skin) {
            case "minimal":
                return <SkinMinimal key={source} attributes={attributes} />;
            case "podcast":
                return <SkinPodcast key={source} attributes={attributes} />;
            case "compact":
                return <SkinCompact key={source} attributes={attributes} />;
            case "default":
            default:
                return <SkinDefault key={source} attributes={attributes} />;
        }
    };

    return (
        <div
            className={`h5vp-audio-container h5vp-skin-type-${skin}`}
            style={customStyles}
        >
            {renderSkin()}
        </div>
    );
};

export default AudioPlayer;
