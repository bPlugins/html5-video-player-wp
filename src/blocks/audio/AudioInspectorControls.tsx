import { __ } from "@wordpress/i18n";
import {
    Panel,
    PanelBody,
    TabPanel,
    TextControl,
    ToggleControl,
    SelectControl,
    BaseControl,
    Button,
    __experimentalUnitControl as UnitControl
} from "@wordpress/components";
import { InspectorControls, MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { AudioBlockAttributes, AudioSkin } from "./types";

import { ColorControl } from "../../../../bpl-tools/Components/ColorControl/ColorControl";
import CopyShortcode from "../Components/Backend/CopyShortcode";
import panelBodyController from "../../../../wp-utils/v1/panelBodyController";

import { skinIcon, trackIcon, playbackIcon, controlsIcon, dimensionsIcon, colorsIcon } from "./icons";

interface AudioInspectorControlsProps {
    attributes: AudioBlockAttributes;
    setAttributes: (attrs: Partial<AudioBlockAttributes>) => void;
}

const panelTitle = (icon: any, label: string) =>
    (<div className="bPlPanelBody h5vp-panel-icon">{icon} <span>{label}</span></div>) as unknown as string;

const AudioInspectorControls = ({ attributes, setAttributes }: AudioInspectorControlsProps) => {
    const {
        autoplay,
        loop,
        preload,
        skin = "default",
        showDownload,
        showSpeed = true,
        showSkip = true,
        showVolume = true,
        width,
        borderRadius,
        backgroundColor,
        textColor,
        title,
        artist,
        artwork
    } = attributes;

    return (
        <InspectorControls>
            <CopyShortcode />
            <TabPanel
                className="bPlTabPanel h5vpTabPanel h5vpAudioTabPanel"
                activeClass="active-tab activeTab"
                onSelect={panelBodyController}
                tabs={[
                    { name: "general", title: __("General", "html5-video-player") },
                    { name: "style", title: __("Style", "html5-video-player") },
                ]}
            >
                {(tab) => (
                    <>
                        {tab.name === "general" && (
                            <Panel>
                                {/* Skin Selection */}
                                <PanelBody title={panelTitle(skinIcon, __("Player Skin", "html5-video-player"))} initialOpen={true}>
                                    <SelectControl
                                        label={__("Skin Layout", "html5-video-player")}
                                        value={skin}
                                        options={[
                                            { label: __("Modern Bar (Default)", "html5-video-player"), value: "default" },
                                            { label: __("Waveform (Minimal)", "html5-video-player"), value: "minimal" },
                                            { label: __("Podcast Card (Rich)", "html5-video-player"), value: "podcast" },
                                            { label: __("Compact Pill (Inline)", "html5-video-player"), value: "compact" },
                                        ]}
                                        onChange={(val) => setAttributes({ skin: val as AudioSkin })}
                                    />
                                </PanelBody>

                                {/* Track Info (Especially for Podcast / Card Skin) */}
                                {skin === "podcast" && (
                                    <PanelBody title={panelTitle(trackIcon, __("Track Details", "html5-video-player"))} initialOpen={false}>
                                        <TextControl
                                            label={__("Track Title", "html5-video-player")}
                                            value={title || ""}
                                            placeholder={__("e.g. Episode 1: The Future of Tech", "html5-video-player")}
                                            onChange={(title: string) => setAttributes({ title })}
                                        />
                                        <TextControl
                                            label={__("Artist / Podcast Host", "html5-video-player")}
                                            value={artist || ""}
                                            placeholder={__("e.g. John Doe", "html5-video-player")}
                                            onChange={(artist: string) => setAttributes({ artist })}
                                        />
                                        <BaseControl label={__("Cover Artwork", "html5-video-player")} id="h5vp-artwork-picker">
                                            {artwork && (
                                                <div style={{ marginBottom: "10px" }}>
                                                    <img
                                                        src={artwork}
                                                        alt=""
                                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                                    />
                                                </div>
                                            )}
                                            <MediaUploadCheck>
                                                {/* @ts-ignore */}
                                                <MediaUpload
                                                    onSelect={(media: any) => setAttributes({ artwork: media?.url || "" })}
                                                    allowedTypes={["image"]}
                                                    render={({ open }: { open: () => void }) => (
                                                        <div style={{ display: "flex", gap: "8px" }}>
                                                            <Button variant="secondary" onClick={open}>
                                                                {artwork ? __("Replace Artwork", "html5-video-player") : __("Upload Artwork", "html5-video-player")}
                                                            </Button>
                                                            {artwork && (
                                                                <Button variant="tertiary" isDestructive onClick={() => setAttributes({ artwork: "" })}>
                                                                    {__("Remove", "html5-video-player")}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </MediaUploadCheck>
                                        </BaseControl>
                                    </PanelBody>
                                )}

                                {/* Playback */}
                                <PanelBody title={panelTitle(playbackIcon, __("Playback", "html5-video-player"))} initialOpen={false}>
                                    <ToggleControl
                                        label={__("Autoplay", "html5-video-player")}
                                        help={autoplay ? __("Most browsers restrict autoplay with audio enabled.", "html5-video-player") : ""}
                                        checked={autoplay}
                                        onChange={(autoplay) => setAttributes({ autoplay })}
                                    />
                                    <ToggleControl
                                        label={__("Loop Playback", "html5-video-player")}
                                        checked={loop}
                                        onChange={(loop) => setAttributes({ loop })}
                                    />
                                    <SelectControl
                                        label={__("Preload", "html5-video-player")}
                                        value={preload}
                                        options={[
                                            { label: __("None", "html5-video-player"), value: "none" },
                                            { label: __("Metadata", "html5-video-player"), value: "metadata" },
                                            { label: __("Auto", "html5-video-player"), value: "auto" },
                                        ]}
                                        onChange={(preload: any) => setAttributes({ preload })}
                                    />
                                </PanelBody>

                                {/* Controls */}
                                <PanelBody title={panelTitle(controlsIcon, __("Controls", "html5-video-player"))} initialOpen={false}>
                                    <ToggleControl
                                        label={__("Show Volume Control", "html5-video-player")}
                                        checked={showVolume}
                                        onChange={(showVolume) => setAttributes({ showVolume })}
                                    />
                                    {(skin === "default" || skin === "podcast") && (
                                        <>
                                            <ToggleControl
                                                label={__("Show Speed Selector", "html5-video-player")}
                                                checked={showSpeed}
                                                onChange={(showSpeed) => setAttributes({ showSpeed })}
                                            />
                                            <ToggleControl
                                                label={__("Show 10s Skip Buttons", "html5-video-player")}
                                                checked={showSkip}
                                                onChange={(showSkip) => setAttributes({ showSkip })}
                                            />
                                        </>
                                    )}
                                    <ToggleControl
                                        label={__("Show Download Link", "html5-video-player")}
                                        checked={showDownload}
                                        onChange={(showDownload) => setAttributes({ showDownload })}
                                    />
                                </PanelBody>
                            </Panel>
                        )}

                        {tab.name === "style" && (
                            <Panel>
                                {/* Dimensions */}
                                <PanelBody title={panelTitle(dimensionsIcon, __("Dimensions", "html5-video-player"))} initialOpen={true}>
                                    {/* @ts-ignore */}
                                    <UnitControl
                                        label={__("Player Width", "html5-video-player")}
                                        value={width}
                                        placeholder="100%"
                                        onChange={(width?: string) => setAttributes({ width: width || "" })}
                                    />
                                    {/* @ts-ignore */}
                                    <UnitControl
                                        label={__("Border Radius", "html5-video-player")}
                                        value={borderRadius}
                                        placeholder={
                                            skin === "compact"
                                                ? "40px"
                                                : skin === "minimal" || skin === "podcast"
                                                ? "16px"
                                                : "12px"
                                        }
                                        onChange={(borderRadius?: string) => setAttributes({ borderRadius: borderRadius || "" })}
                                    />
                                </PanelBody>

                                {/* Colors */}
                                <PanelBody title={panelTitle(colorsIcon, __("Colors", "html5-video-player"))} initialOpen={false}>
                                    <ColorControl
                                        //@ts-ignore
                                        label={__("Background Color", "html5-video-player")}
                                        color={backgroundColor}
                                        value={backgroundColor}
                                        onChange={(val: string) => setAttributes({ backgroundColor: val || "" })}
                                    />
                                    <ColorControl
                                        //@ts-ignore
                                        label={__("Text Color", "html5-video-player")}
                                        color={textColor}
                                        value={textColor}
                                        onChange={(val: string) => setAttributes({ textColor: val || "" })}
                                    />
                                </PanelBody>
                            </Panel>
                        )}
                    </>
                )}
            </TabPanel>
        </InspectorControls>
    );
};

export default AudioInspectorControls;
