import { PanelBody } from "@wordpress/components"
import Title from "../Title"
import { __ } from "@wordpress/i18n"
import PresetsIcon from "../../../../../icons/PresetsIcon"
import { DEFAULT_PRESETS } from "src/blocks/constants"
import Notice from "../../../../../../../bpl-tools/Components/Notice"


const Presets = ({ presetId, setAttributes }: { presetId: number | string | null, setAttributes: (attributes: any) => void }) => {

    return <PanelBody title={<Title title={__("Presets", "html5-video-player")} Icon={PresetsIcon} /> as unknown as string} initialOpen={true}>

        <div className="h5vp_presets">
            {DEFAULT_PRESETS.map((p) => (
                <div
                    key={p!.id}
                    className={`h5vp_preset ${p!.id == presetId ? "active" : ""}`}
                    onClick={() => setAttributes({ presetId: p!.id, preset: p })}
                >
                    <div className="preset_letter">
                        {p!.icon}
                    </div>
                    <div className="preset_name">
                        {p!.name}
                    </div>
                </div>
            ))}
        </div>

        <Notice isIcon={true} status={"premium"}>{__('Add custom preset availabel in premium version', 'html5-video-player')}</Notice>
    </PanelBody>
}

export default Presets