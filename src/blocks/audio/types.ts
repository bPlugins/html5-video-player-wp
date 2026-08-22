export type AudioSkin = "default" | "minimal" | "compact";

export interface AudioBlockAttributes {
    source: string;
    autoplay: boolean;
    loop: boolean;
    preload: "none" | "metadata" | "auto";
    skin: AudioSkin;
    showDownload: boolean;
    showSpeed?: boolean;
    showSkip?: boolean;
    showVolume?: boolean;
    width: string;
    borderRadius?: string;
    backgroundColor: string;
    primaryColor?: string;
    textColor?: string;
    title?: string;
    artist?: string;
    artwork?: string;
}