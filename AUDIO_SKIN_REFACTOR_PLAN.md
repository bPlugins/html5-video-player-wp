# Audio Player — Skin Duplication Audit & Refactor Plan

Scope: `src/blocks/audio/` (untracked / unreleased — no back-compat burden).
Nothing outside this folder references its class names, so renames are free.

## 1. Current size

| File | Lines |
|---|---|
| `player/SkinPodcast.tsx` | 301 |
| `player/SkinDefault.tsx` | 279 |
| `player/SkinMinimal.tsx` | 241 |
| `player/SkinCompact.tsx` | 171 |
| `player/AudioPlayer.tsx` | 54 |
| `player/useAudioEngine.ts` | 277 |
| `player/useAudioWaveform.ts` | 236 |
| `style.scss` | ~1100 |

The engine (`useAudioEngine`) is already correctly shared — all playback state,
seek, volume, rate and RAF ticking live there once. **The duplication is entirely
in the presentation layer**: ~480 of the 992 skin lines (≈50%) plus ~250 SCSS
lines are the same component written four times under four different class-name
prefixes.

## 2. Root cause

Each skin invented its own BEM prefix for the *same* widget:

| Widget | Default | Podcast | Compact | Minimal |
|---|---|---|---|---|
| progress rail | `h5vp-progress-*` | `h5vp-progress-*` | `h5vp-compact-*` | (waveform) |
| volume popover | `h5vp-volume-*` | `h5vp-volume-*` | `h5vp-compact-vol-*` | `h5vp-wave-vol-*` |
| icon buttons | `h5vp-btn-*` | `h5vp-btn-*` | `h5vp-compact-*-btn` | `h5vp-wave__*` |

Because the markup class names diverge, the JSX cannot be shared **and** the CSS
cannot be shared. `style.scss:929-1020` already admits this — the volume popover
rules are held together by a hand-maintained 3-selector comma list.

## 3. Duplication inventory

### TSX

| # | Duplicated thing | Skins | Approx. lines wasted | Notes |
|---|---|---|---|---|
| D1 | `handleVolumePointer` + `handleVolumePointerMove` | all 4 | 4 × 16 = 64 | **byte-identical** after indent normalization |
| D2 | Volume popover JSX (wrapper → popover → track → rail → fill → thumb) | all 4 | 4 × 45 = 180 | differs only in class prefix |
| D3 | Volume icon SVGs | all 4 | 4 × 14 = 56 | Default has 3 states (mute/low/high), other three only 2 — an inconsistency, not a design choice |
| D4 | Outside-click `useEffect` | all 4 | 4 × 14 = 56 | Default≡Podcast byte-identical; Minimal≡Compact byte-identical |
| D5 | Play/pause button + SVGs | all 4 | 4 × 12 = 48 | Minimal's copy omits `fill="currentColor"` and relies on CSS instead |
| D6 | Download link + SVG | all 4 | 4 × 12 = 48 | stroke-linecap present in 2 copies, missing in 2 |
| D7 | `handleProgressPointerDown` / `PointerMove` | Default, Compact, Podcast | 3 × 20 = 60 | Default's Move additionally tracks hover tooltip |
| D8 | Progress rail JSX (wrapper/rail/buffered/played/thumb + full ARIA slider block) | Default, Compact, Podcast | 3 × 25 = 75 | identical structure, 12 identical ARIA attrs |
| D9 | Speed button + popover + `const SPEEDS` | Default, Podcast | 2 × 38 = 76 | `SPEEDS` array declared twice |
| D10 | Skip ±10 buttons + badge | Default, Podcast | 2 × 30 = 60 | |
| D11 | `<audio {...engine.audioProps} className="h5vp-audio-native-el" />` | all 4 | 4 | belongs in a shared shell |
| D12 | State-name drift for one concept | — | — | `isVolumeOpen` (Default/Podcast) vs `showVolumeSlider` (Minimal/Compact) |

### SCSS

| # | Duplicated thing | Where | Lines wasted | Only real difference |
|---|---|---|---|---|
| S1 | Progress rail rule set written 3× | `:229-283`, `:625-675`, `:862-906` | ~2 × 50 = 100 | rail height 5/4/4px, radius 3/2/2px, thumb 12/10/8px |
| S2 | Speed popover + item rule set written 2× | `:301-364`, `:743-800` | ~60 | popover `right:0` vs `left:0`, item padding |
| S3 | Icon-button rule set written 3× | `:418-443`, `:810-825`, `:522-548` | ~50 | box size 30/26/28px, opacity |
| S4 | Volume popover held by a 3-selector comma list | `:929-1020` | 0 wasted, but 6 selector lists to hand-maintain on every edit | class prefix only |

## 4. Target structure

```
src/blocks/audio/player/
  AudioPlayer.tsx          container + CSS vars (unchanged role)
  useAudioEngine.ts         (unchanged)
  useAudioWaveform.ts       (unchanged)
  useOutsideClick.ts       NEW — kills D4
  constants.ts             NEW — SPEEDS, BAR_WIDTH/GAP/MIN/MAX, ARROW_SEEK_SECONDS
  utils.ts                 NEW — getFileName (currently private to Podcast)
  parts/
    Icons.tsx              NEW — Play, Pause, VolumeMute/Low/High, SkipBack,
                                 SkipForward, Download, Disc  (kills D3/D5/D6 SVG bodies)
    PlayPauseButton.tsx    NEW — kills D5
    SkipButton.tsx         NEW — direction prop, kills D10
    SpeedControl.tsx       NEW — owns open state + outside click, kills D9
    VolumeControl.tsx      NEW — owns open state, both pointer handlers, icon,
                                 popover; kills D1 + D2 + D3 + D12
    DownloadButton.tsx     NEW — kills D6
    ProgressBar.tsx        NEW — owns seek pointer handlers, ARIA slider,
                                 optional hover tooltip + buffered; kills D7 + D8
    TimeDisplay.tsx        NEW — trivial, keeps tabular-nums class in one place
    AudioShell.tsx         NEW — renders <audio> + skin root div; kills D11
  SkinDefault.tsx          → layout only
  SkinMinimal.tsx          → waveform + layout only
  SkinCompact.tsx          → layout only
  SkinPodcast.tsx          → artwork/meta + layout only
```

Expected result: 992 skin lines → **~330** (Default ~75, Compact ~55, Podcast ~120,
Minimal ~85), plus ~420 lines of shared parts that each exist once.

## 5. Class-name unification

One canonical set for every skin; per-skin variation moves to the container class
that `AudioPlayer.tsx` already emits (`.h5vp-skin-type-{skin}`).

- `h5vp-compact-rail`, `h5vp-progress-rail` → `h5vp-progress-rail`
- `h5vp-compact-buffered` / `-played` / `-thumb` → `h5vp-progress-buffered` / `-played` / `-thumb`
- `h5vp-compact-vol-*`, `h5vp-wave-vol-*`, `h5vp-volume-*` → `h5vp-vol-*`
- `h5vp-compact-vol-btn`, `h5vp-wave__volume` → `h5vp-btn-volume`
- `h5vp-compact-dl-btn`, `h5vp-wave__download` → `h5vp-btn-download`
- `h5vp-compact-play-btn`, `h5vp-podcast-play-btn`, `h5vp-wave__toggle` → `h5vp-btn-play`
- `h5vp-compact-time`, `h5vp-wave__time`, `h5vp-time` → `h5vp-time`
- Keep genuinely skin-specific names: `h5vp-podcast-artwork/meta/title/artist/card`,
  `h5vp-wave__track`, `h5vp-wave__bar`, `h5vp-compact-pill`, `h5vp-default-controls`.

Then the size differences become three declarations on the container:

```scss
.h5vp-skin-type-default  { --h5vp-rail-h: 5px; --h5vp-rail-r: 3px; --h5vp-thumb: 12px; --h5vp-icon-btn: 30px; }
.h5vp-skin-type-podcast  { --h5vp-rail-h: 4px; --h5vp-rail-r: 2px; --h5vp-thumb: 10px; --h5vp-icon-btn: 30px; }
.h5vp-skin-type-compact  { --h5vp-rail-h: 4px; --h5vp-rail-r: 2px; --h5vp-thumb:  8px; --h5vp-icon-btn: 26px; }
.h5vp-skin-type-minimal  {                                                              --h5vp-icon-btn: 28px; }
```

…and S1/S2/S3/S4 collapse into one rule set each. `style.scss` ~1100 → ~650 lines,
with the four responsive overrides at `:1029-1080` shrinking to token overrides.

## 6. Execution order

Each step compiles and is independently verifiable; do them in this order so no
step needs a rewrite by a later one.

1. **`Icons.tsx`** — extract every SVG verbatim. Adopt Default's 3-state volume
   icon everywhere (upgrade, not a regression) and add the missing
   `strokeLinecap`/`strokeLinejoin` so all copies converge on the better version.
   Swap all four skins to it. *No behaviour change beyond the two icon fixes.*
2. **`useOutsideClick.ts`** — `useOutsideClick(ref, isOpen, onClose)`. Replace D4
   in all four skins. Default/Podcast call it twice (speed + volume) instead of
   one combined effect.
3. **`constants.ts` + `utils.ts`** — hoist `SPEEDS`, waveform constants, `getFileName`.
4. **`VolumeControl.tsx`** — the biggest win (D1+D2+D3+D12, ~300 lines). Props:
   `engine`, plus nothing else — it owns its state. Standardize on `isOpen`.
5. **`ProgressBar.tsx`** — props `engine`, `showTooltip?`, `showBuffered?`.
   Fold Default's hover-tooltip into it behind `showTooltip`. Also move
   Minimal's keyboard `handleKeyDown` in as a shared behaviour — Default,
   Compact and Podcast are currently missing keyboard seek despite carrying
   `role="slider" tabIndex={0}`, which is an a11y bug the shared part fixes.
6. **`PlayPauseButton` / `SkipButton` / `DownloadButton` / `TimeDisplay`.**
7. **`SpeedControl.tsx`** — Default + Podcast.
8. **`AudioShell.tsx`** — `<audio>` + root div, so a skin returns layout only.
9. **Class-name unification pass** across the four skins and the parts.
10. **SCSS collapse** — merge S1–S4 into single rule sets driven by the container
    tokens from §5; delete the comma lists at `:929-1020`.

## 7. Verification per step

- `npm run build` after each step (block build must stay clean).
- Manual pass on all four skins in the editor **and** on the front end
  (`view.tsx` mount path), checking: play/pause, seek by drag, seek by click,
  keyboard seek, buffered bar, volume popover open/close + outside click,
  speed popover, skip ±10, download, autoplay, loop, mobile breakpoint
  (`style.scss:1029+`).
- Minimal's waveform lazy-decode latch (`waveformRequested`) must stay untouched —
  it is a deliberate bandwidth optimization, not duplication.

## 8. Explicit non-goals

- Do not touch `useAudioEngine.ts` or `useAudioWaveform.ts` — already shared and correct.
- Do not change `render.php`, `block.json` attributes, or `view.tsx`.
- Do not add new user-facing features or settings while refactoring.

---

# Outcome (executed)

All ten steps landed. `npx tsc --noEmit` clean (0 errors project-wide);
`wp-scripts build` compiles successfully.

| Measure | Before | After |
|---|---|---|
| Four skin files | 992 lines | **322** lines |
| Shared presentation layer | 0 | 549 lines (9 parts + hook + constants + utils) |
| `style.scss` | 1079 lines | **801** lines |
| Compiled minified CSS | 20,306 bytes | **14,544** bytes |
| CSS rule blocks | 132 | **91** |

Residual duplication check across the four skins: zero `<svg>`, zero
`handleVolumePointer`, zero `mousedown` listeners, zero `SPEEDS`. The only
remaining `getBoundingClientRect` is the minimal skin's waveform track, which is
genuinely skin-specific.

## Deviations from the plan

- **Step 9 merged into steps 4–8.** Rewriting a skin against parts that emit
  canonical names *is* the rename, so a separate pass would have edited the same
  lines twice.
- **`useAudioEngine.ts` gained one additive line** — `export type AudioEngine =
  ReturnType<typeof useAudioEngine>`, the prop type every part needs. The hook's
  behaviour is untouched, so the §8 non-goal holds in substance.
- **Podcast's play button lost its `h5vp-btn-play-lg` modifier.** Skin-scoped
  tokens already size it, so the modifier was redundant.

## Fixes that fell out of the consolidation

1. **Keyboard seek now works in three more skins.** Default, compact and podcast
   advertised `role="slider" tabIndex={0}` with no `onKeyDown` — focusable but
   inert. The shared `ProgressBar` carries minimal's handler, so arrows/Home/End
   seek everywhere.
2. **Three-state volume icon everywhere** (was default-only) and
   `aria-valuetext` on every seek rail (was minimal-only).
3. **`touch-action: none` on every rail** — only default had it, so touch-drag
   seek scrolled the page instead of scrubbing on the other two.
4. **`aria-expanded` added** to both popover triggers.
5. **Deleted genuinely dead CSS**: `.h5vp-volume-slider-box` and
   `.h5vp-volume-range` (~30 lines) were leftovers from an older range-input
   volume UI and matched no markup even before this refactor.
6. **Fixed compounding opacity** on the podcast timestamp row: `.h5vp-time` now
   carries `opacity: .75`, so leaving it on the row too would have multiplied to
   0.56.

## Known pre-existing, left alone (out of scope)

- `h5vp-artwork-picker` (editor inspector) is emitted but styled nowhere.
- `h5vp-wave`, `is-playing`, `is-ready` on the minimal shell are unstyled DOM
  hooks — possibly intended for user CSS, so left in place.
- The repo has no `eslint.config.js`, so `npm run lint` fails on ESLint 9 for
  the whole project, not just this block.

## Still needs your eyes

Automated checks can't confirm pixels. Worth a visual pass on all four skins in
the editor and on the front end, especially: default skin's hover tooltip and
hide-until-hover thumb, podcast's 44px hero button and artwork card, compact's
pill at 26px icons, and the 480px breakpoint.
