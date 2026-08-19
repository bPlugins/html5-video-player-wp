# Options moved from Pro to Free (parity notes for the Pro plugin)

**Date:** 2026-08-17, revised 2026-08-19 · **Free version:** 2.12.0 (unreleased dev) ·
**Pro version at time of writing:** 2.13.0

Covers four items: **Preload** (section 1), **Allow inline playback on iOS /
`playsinline`** (section 2), a brand-new **Audio Player block** (section 3 — not an
option added to the existing video pipeline, but a standalone block with no shared
code), and **Player alignment** (section 4).

The **Playlist** block is documented separately in `PLAYLIST_FREE_FEATURE_PLAN.md`.

> **Pro-side status:** sections 3 and 4 have been applied to the Pro plugin already
> (see the "Status in Pro" note in each). Sections 1 and 2 are still de-gating work
> for Pro — their "Required changes in Pro" subsections are outstanding.

---

# 1. Preload

The free plugin now exposes the **Preload** option on every configuration surface
(block editor, classic metabox, Quick Player, Elementor, shortcode). It uses the
exact same storage keys, value vocabulary, and defaults Pro already uses, so data
written by either plugin is read correctly by the other — nothing on the Pro side
is *required* for data compatibility. What Pro **should** change is its UI gating,
so an unlicensed Pro install doesn't show Preload as locked while plain Free
offers it ungated.

## Canonical keys — do not rename, do not change defaults

| Surface | Key / attribute | Values | Default |
|---|---|---|---|
| Block editor (all blocks) | `options.preload` (inside the `options` object attribute) | `none` / `metadata` / `auto` | `metadata` |
| Block legacy top-level attr | `preload` (string attribute, pre-refactor blocks only) | same | `metadata` |
| Classic metabox (`videoplayer` post meta) | `h5vp_preload_playerio` | same | `metadata` (falls back to global) |
| Global default (Settings → `h5vp_option`) | `h5vp_op_preload_playerio` | same | `metadata` |
| Quick Player (`h5vp_quick` option) | `h5vp_preload_quick` | same | `metadata` |
| Shortcode | `[video_player preload="…"]` | same | `h5vp_preload_quick`, then `metadata` |
| Elementor control | `preload` (SELECT) | same | `metadata` |

Free's metabox field default is `$preset('h5vp_op_preload_playerio', 'metadata')` —
it reads the global default if one was saved (e.g. while Pro was active), same as
Pro. Free has **no UI** for `h5vp_op_preload_playerio` itself; that stays a
Pro-only field (`inc/Field/SettingsPro.php:149`).

## Behavior rules Free follows (match these in Pro)

1. **Hidden for YouTube/Vimeo.** `preload` is an HTML `<video>` attribute; the
   iframe embeds never use it. Free hides the control on all surfaces:
   - Block editor: `!["youtube", "vimeo"].includes(provider)` around the control.
   - CSF metabox: `'dependency' => array('h5vp_video_source', 'any', 'library', 'all')`
     (the trailing `'all'` is required — controller lives in another section).
   - Elementor: `'condition' => array('video_source' => 'library')`.

   Pro currently shows Preload for every provider — recommend adopting the same
   gating (UI-only; no stored key changes, so it's downgrade/upgrade safe).
   Note: Pro's source key values include `amazons3` etc.; extend the dependency
   value list accordingly (preload works for self-hosted **and** amazons3 —
   Free's renderer branch is `['self-hosted', 'amazons3'].includes(videoSource)`).

2. **Hidden when a preset is selected.** Block editor control is inside
   `!presetId` — same as Pro already does.

3. **Missing-value fallback.** Blocks saved before the option existed have no
   `options.preload`. Free displays and renders `options.preload || "metadata"`
   instead of a phantom/empty selection:
   - editor select: `value={preload || "metadata"}`
   - front end: `preload={options.preload || 'metadata'}` (Common/VideoPlayer.tsx)

   Pro currently passes `value={preload}` / `preload={options.preload}` raw —
   recommend the same fallback.

4. **Legacy top-level `preload` block attribute.** Free registers it **only on
   the `video` block** (needed so `RefactorDataStructure` can migrate
   pre-refactor blocks and `Block.php::classic_to_gutenberg_block` output isn't
   stripped in the editor). It was deliberately **not** added to youtube/vimeo
   block.json — the value is dead there. Pro registers it on all three blocks;
   keeping that is harmless, no action needed.

## Required changes in Pro (de-gate the license lock)

Preload is free now; an unlicensed Pro install must not lock it:

1. `inc/Field/VideoPlayer.php` (~line 353, `h5vp_preload_playerio`):
   remove `'class' => 'bplugins-meta-readonly',`
2. `inc/Field/QuickPlayer.php` (~line 98, `h5vp_preload_quick`):
   remove `'class' => 'bplugins-meta-readonly',`
3. `src/blocks/Components/Backend/Tabs/General/Settings.tsx` (~lines 158–171,
   the Preload `BToggleControl`): replace the spread `{...props}` gating with
   `isPremium={true}` (the file already uses `isPremium={true} // means its free`
   for the Skin control — same pattern), or add `isPremium={true}` **after**
   `{...props}` so it wins.
4. Check Pro's upsell/marketing surfaces (readme, pricing tables, feature lists,
   `QuickPlayer.php` pro-notice HTML) and drop "Preload" from any
   premium-features list. Free's readme now lists Preload under Free Features
   and Pro's bullet was reworded to "Page Load Optimizer" only.
5. Pro `inc/Elementor/VideoPlayer.php` (the variant served to unlicensed
   installs) has **no** preload control at all — add the same control Free added
   (see below) so unlicensed Pro matches Free. `VideoPlayerPro.php` already has
   it (control ~line 365, render ~line 1095).

## Reference — what Free added (copy from these if useful)

All in `html5-video-player` (free):

- `src/blocks/Components/Backend/Tabs/General/Settings.tsx` — Preload select,
  provider + preset gating, `metadata` display fallback; removed "Preload" from
  the premium-features upsell list.
- `src/blocks/video/block.json` — top-level `"preload": {"type":"string","default":"metadata"}`.
- `src/blocks/Components/Common/VideoPlayer.tsx` — render fallback `|| 'metadata'`.
- `inc/Field/VideoPlayer.php` — `h5vp_preload_playerio` radio + cross-section
  dependency; reads `h5vp_op_preload_playerio` for its default.
- `inc/Field/QuickPlayer.php` — `h5vp_preload_quick` radio.
- `inc/Elementor/VideoPlayer.php` — `preload` SELECT (condition `video_source => library`)
  and `'preload' => self::i($s, 'preload', '', 'metadata')` in the rendered options.
- `readme.txt` — Preload moved to Free Features.

`inc/Helper/Block.php` already read all these keys in both plugins — untouched.

---

# 2. Allow inline playback on iOS (`playsinline`)

Free now exposes this toggle on **all** surfaces. Pro previously had it in the
block editor + shortcode only; the metabox / Quick Player / Elementor keys are
**new, defined by Free** — Pro must add matching fields AND read the same keys
in its render paths, otherwise a value set under Free stops working after an
upgrade to Pro.

## Canonical keys

| Surface | Key / attribute | Values | Default |
|---|---|---|---|
| Block editor (all blocks) | `options.playsinline` | boolean | `true` (block.json options default) |
| Block legacy top-level attr | `playsinline` | boolean | `false` — already registered in **both** plugins' block.json, untouched |
| Classic metabox (`videoplayer` post meta) | `h5vp_playsinline_playerio` | `'1'` / `'0'` (CSF switcher) | `'1'`; **unset (`''`) must resolve to `true`** — see rule below |
| Global default (Settings → `h5vp_option`) | `h5vp_op_playsinline_playerio` | `'1'` / `'0'` | `'1'` — reserved: metabox default reads it; no UI writes it yet (add to Pro `SettingsPro.php` if desired) |
| Quick Player (`h5vp_quick` option) | `h5vp_playsinline_quick` | `'1'` / `'0'` | `'1'` |
| Shortcode | `[video_player playsinline="true/false"]` | `true`/`false` | absent → `h5vp_playsinline_quick`, then `true` |
| Elementor control | `playsinline` (SWITCHER, `return_value` `'1'`) | `'1'` / `''` | `'1'` |

The legacy shortcode attr `ios_native` is declared in both plugins but read by
neither; left as-is.

## Back-compat rule (CRITICAL — do not change)

Before this change every render path hardcoded `playsinline => true`. Players,
widgets, and shortcodes saved **before** the fields existed have no stored
value, and they must keep behaving as `true`:

- Metabox read: `get_post_meta(...) == '1'`, with `''` (never saved) mapped to
  `'1'` first. Free implements this as
  `$this->get_post_meta($id, 'h5vp_playsinline_playerio', '1') == '1'` — do NOT
  use the helper's `$is_boolean` mode, it maps unset to `false`.
- Elementor read: `self::i($s, 'playsinline', '', '1') === '1'` (Elementor
  back-fills the control default for old widgets anyway; the `'1'` fallback is
  belt-and-braces).
- Shortcode/Quick read: `$get_attr('playsinline', $quick('h5vp_playsinline_quick', '1'), true)`.

## What Free changed

- `src/blocks/Components/Backend/Tabs/General/Settings.tsx` — toggle identical
  to Pro's (same label, `helpText.playsinline`,
  `handleOptions({ playsinline: !playsinline })`), shown unconditionally — no
  `presetId`/provider gate, matching Pro. (Plyr forwards playsinline to embeds,
  so unlike preload it is not provider-gated.)
- `inc/Field/VideoPlayer.php` — `h5vp_playsinline_playerio` switcher, default
  `$preset('h5vp_op_playsinline_playerio', '1')`.
- `inc/Helper/Block.php` — classic conversion reads the meta (back-compat rule
  above); shortcode conversion falls back to `h5vp_playsinline_quick`.
- `inc/Field/QuickPlayer.php` — `h5vp_playsinline_quick` switcher, default `'1'`;
  removed "Allow Inline Playback on iOS" from the pro-notice feature list.
- `inc/Elementor/VideoPlayer.php` — `playsinline` SWITCHER (default `'1'`) +
  `'playsinline' => self::i($s, 'playsinline', '', '1') === '1'` in the options.
- `inc/Services/Shortcodes.php` — added `'playsinline' => null` to
  `video_player_attrs()`. Free's `Block.php` already consumed the attr; without
  the whitelist entry `shortcode_atts()` stripped it, so `playsinline="false"`
  silently did nothing. Pro already whitelists it (`ShortcodesPro.php:96`).
- `readme.txt` — moved to Free Features; Pro bullet reworded to Disable Pause
  only; `playsinline="true/false"` added to the shortcode attribute list.

## Required changes in Pro

1. **De-gate the license lock**:
   `src/blocks/Components/Backend/Tabs/General/Settings.tsx` (~line 120, the
   playsinline `BToggleControl`): add `isPremium={true}` after `{...props}` —
   same pattern as Preload above.
2. **Mirror the new fields** (copy from Free's files listed above, keys and
   defaults must match exactly):
   - `inc/Field/VideoPlayer.php` + `VideoPlayerPro.php`: add
     `h5vp_playsinline_playerio` switcher.
   - `inc/Field/QuickPlayer.php` + `QuickPlayerPro.php`: add
     `h5vp_playsinline_quick` switcher.
   - `inc/Elementor/VideoPlayer.php` + `VideoPlayerPro.php`: add the
     `playsinline` control and options wiring.
3. **Mirror the render reads** in Pro's `inc/Helper/Block.php`:
   - classic path (~line 59): replace hardcoded `"playsinline" => true` with the
     back-compat read above.
   - shortcode path (~line 285): default via `$quick('h5vp_playsinline_quick', '1')`.
4. Scrub "Allow Inline Playback on iOS" / "Inline iOS Playback" from Pro's
   upsell/marketing surfaces (readme, pricing tables, notice HTML).

## Shared quirks — identical in both plugins, deliberately left alone

- `MyPlayer.ts` hardcodes `playsinline: true` in the Plyr constructor options in
  **both** plugins, so after Plyr initializes, the stored value mainly affects
  the raw `<video>` attribute rendered before/without Plyr. Fixing that (passing
  the real value through) would change behavior — if ever done, do it in both
  plugins in the same release.
- `RefactorDataStructure.tsx` migrates the legacy value by reading
  `attributes.playinline` (typo, missing the "s") in **both** plugins, while
  both block.json files register `playsinline` — so the pre-refactor value is
  never actually migrated and falls back to the options default. Same behavior
  both sides; fix in both or neither.

---

# 3. Audio Player block (`html5-player/audio`) — new, standalone

> **Revised 2026-08-19.** The original draft of this section described a Plyr-based
> block built around a `player/initAudioPlyr.ts` helper and an 8-attribute contract.
> The block that actually shipped is a **self-contained React player** with a
> 16-attribute contract and no Plyr involvement at all. The tables below are
> regenerated from `src/blocks/audio/block.json` and are the contract; the earlier
> draft is superseded — following it would have produced a mismatched attribute set
> and destroyed audio blocks on upgrade.

Unlike sections 1-2, this is not an attribute added to the existing video/youtube/
vimeo pipeline. It is a **deliberately independent block** — own editor UI, own
frontend mount, own render template — sharing no code with
`EditBlock`/`BSettings`/`VideoPlayer.tsx`/`MyPlayer.ts`, and no Plyr either. Playback
is a plain `<audio>` element driven by a React hook, with four hand-drawn skins.

## Status in Pro

**Already ported (2026-08-19).** `src/blocks/audio/` was copied into the Pro plugin,
`register_block_type(H5VP_PRO_PLUGIN_PATH . 'build/blocks/audio')` and
`localize_audio_block()` were added to Pro's `blocks.php`, and the copy's text domain
was switched from `html5-video-player` to `h5vp` (the block *name* and every attribute
were deliberately left untouched — see below). Verified by activating Pro over free and
confirming a free-authored audio block renders with all 16 attributes intact.

## Why standalone (don't try to merge it into the video pipeline)

The existing pipeline is built entirely around video semantics: aspect ratio,
poster-as-background, fullscreen/PiP, YouTube/Vimeo providers, the `h5vp_videos`
view-tracking table, and `MyPlayer.ts`'s 650-line surface for HLS/quality/tracks/PiP
that audio has no use for. Bolting audio onto that would mean threading audio
conditionals through ~10 video-owned files for close to zero reuse.

## File layout

```
src/blocks/audio/
  block.json        name: "html5-player/audio"; plain file: refs for index/view
                     JS+CSS. No "bplugins-plyrio" handle — this block never loads Plyr.
  index.ts          registerBlockType — own Edit, own editor.scss
  Edit.tsx          self-contained editor UI (MediaPlaceholder + AudioInspectorControls);
                     renders the very same <AudioPlayer> the front end mounts
  AudioInspectorControls.tsx   all 16 attributes' controls
  render.php        own PHP template. Sanitises source/artwork with esc_url_raw() and
                     the text fields with sanitize_text_field(), then emits the payload
                     on an INNER .h5vp_audio_player div (see "Mount contract" below).
                     Does not call h5vp_process_block_attributes(), does not touch the
                     h5vp_videos table.
  view.tsx          mounts <AudioPlayer> on every .h5vp_audio_player, guarded by a
                     data-h5vp-mounted flag. Imports react-dom explicitly so the handle
                     lands in view.asset.php.
  player/AudioPlayer.tsx   skin switch + CSS-custom-property wrapper
  player/SkinDefault.tsx   "Modern Bar"    (progress bar, speed, 10s skip, volume)
  player/SkinMinimal.tsx   "Waveform"      (uses useAudioWaveform)
  player/SkinPodcast.tsx   "Podcast Card"  (artwork, title, artist)
  player/SkinCompact.tsx   "Compact Pill"
  player/useAudioEngine.ts    all playback state: play/pause, seek, buffered, volume,
                     rate, RAF progress loop. No third-party player library.
  player/useAudioWaveform.ts  fetches + decodes the file to draw real peaks, with a
                     deterministic placeholder when CORS or the codec blocks decoding.
                     Decoding IS a second full download, so it is gated three ways and
                     all three must survive any port: it does not run until the
                     `enabled` flag flips (SkinMinimal flips it on first play), it
                     decodes through an OfflineAudioContext at 8kHz so the PCM buffer
                     is ~6x smaller (an hour of 48kHz stereo would otherwise allocate
                     ~1.4GB and OOM a phone), and it skips files over 60MB. Minimal
                     skin only.
  types.ts, global.d.ts, style.scss, editor.scss
```

## Mount contract (do not put the payload on the block wrapper)

`src/blocks/view.tsx` (the shared video bundle, handle `h5vp-view`) mounts `VideoPlayer`
into **any** element matching `[class^="wp-block-html5-player-"]` that carries
`data-attributes`. The audio wrapper matches that prefix, so putting the payload there
means a page holding both a video block and an audio block feeds the audio payload to
the video player and calls `createRoot()` twice on the same node. The payload therefore
lives on an inner `.h5vp_audio_player` div, exactly like the playlist block's
`.h5vp_playlist`. Keep it that way in both plugins.

## Canonical attributes (the contract — match these exactly in Pro)

| Attribute | Type | Default |
|---|---|---|
| `source` | string | `""` |
| `autoplay` | boolean | `false` |
| `loop` | boolean | `false` |
| `preload` | string | `"metadata"` |
| `skin` | string | `"default"` |
| `showDownload` | boolean | `false` |
| `showSpeed` | boolean | `true` |
| `showSkip` | boolean | `true` |
| `showVolume` | boolean | `true` |
| `width` | string | `""` |
| `backgroundColor` | string | `""` |
| `primaryColor` | string | `""` |
| `textColor` | string | `""` |
| `title` | string | `""` |
| `artist` | string | `""` |
| `artwork` | string | `""` |

`supports`: `{"html": false, "align": ["left","center","right","wide","full"]}`.

Valid `skin` values — exact slugs: `default` · `minimal` · `podcast` · `compact`.

There is deliberately **no `muted` attribute**: muted+autoplay audio defeats the point
of an audio player. The Autoplay toggle carries a `help` string warning that most
browsers block non-muted autoplay, so the limitation is disclosed rather than hidden.

**Accent colour.** `primaryColor` IS a per-block attribute (this is the one place the
original draft was actively wrong). `AudioPlayer.tsx` resolves it as
`primaryColor || window.h5vpAudioBlock?.brandColor || "#005aff"` — so an unset block
falls back to the global Settings → Brand Color, and a block that sets its own colour
keeps it. `localize_audio_block()` (hooked to **`enqueue_block_assets`**, not
`enqueue_block_editor_assets` — the front end needs the fallback too) publishes that
global as `window.h5vpAudioBlock`, deliberately a block-scoped object rather than
`window.h5vpBlock`, so it can never clobber the video pipeline's shared payload.

## Live preview parity

`Edit.tsx` renders the identical `<AudioPlayer>` component the front end mounts, from
the identical attributes object — there is no second implementation to drift. The only
difference is that the editor never goes through `render.php`, so it sees unsanitised
attribute values.

## Skin mechanism (the pro extension point)

Each skin is one component under `player/`, all consuming the shared `useAudioEngine`
hook, selected by the `switch (skin)` in `AudioPlayer.tsx`. To add a Pro-only skin:
add the component, add a `case` to that switch, and add the option to the `skin`
`SelectControl` in `AudioInspectorControls.tsx` gated behind
`h5vp_can_use_premium_code()`. The stored value is just a slug, so a Pro-only slug
degrades to `default` under free via the switch's `default:` branch rather than
breaking — no data loss on downgrade.

---

# 4. Player alignment (`align`)

Free exposes an **Alignment** control on every configuration surface: the block editor
(via core's `supports.align`), the classic metabox (`h5vp_align_playerio`), the Quick
Player defaults (`h5vp_align_quick`) plus a per-shortcode `align="…"` attribute, and
the Elementor widget (`align` control).

## Canonical contract

All four surfaces funnel through `h5vp_sanitize_align()` in `inc/functions.php` and
converge on **one** output: the core block attribute `align`, whose accepted values are
`left` · `center` · `right` · `wide` · `full`. Anything unrecognised — including the
empty default every player saved before this field existed carries — returns `''`.

**The key back-compat rule:** the `align` key is only ever *set* when the value is
non-empty. Core's `wp_apply_alignment_support()` branches on `array_key_exists()`, not
`empty()`, so handing it `align => ''` renders a bare `align` class. Players saved
before the field existed resolve to `''`, the key stays absent, and their layout is
untouched.

The CSS lives in `src/blocks/Components/Common/style.scss` and moves the inner
`.plyr_wrapper` with auto margins rather than floats, so the classic metabox, the
shortcode and the Elementor widget all land on the same layout regardless of what the
active theme does with `.alignleft` / `.alignright`. It only has a visible effect once
the player width is below 100% — a full-width player has nowhere to move.

## Status in Pro

**Already ported (2026-08-19).** `supports.align` was added to Pro's
`src/blocks/{video,youtube,vimeo}/block.json` and the alignment CSS block was added to
Pro's `src/blocks/Components/Common/style.scss`.

This was a genuine upgrade-safety bug, not a nicety: `supports.align` is what makes
core register the `align` attribute in the first place. With free declaring it and Pro
not, a free-authored aligned player **lost its alignment class the moment the user
upgraded**, and the editor's `getBlockAttributes()` — which filters parsed attributes
against the registered schema — dropped `align` out of `post_content` on the next save.
Verified by rendering the same post under both plugins before and after the fix.

While there, `skin` was added to Pro's youtube/vimeo `block.json` (it was already on
Pro's video block, and on all three free blocks) to close the last remaining
free-only attribute. **Every attribute free can write is now declared in Pro**, in all
five blocks.
