# html5-video-player — Standing Rules

> Audience: developers and AI agents working on this codebase. Read this before
> changing anything. Claude Code auto-loads this file for this project; if you
> use another AI tool (Antigravity, Gemini, Codex, etc.), copy/rename it to
> `AGENTS.md` (or point that tool at this file) so it gets the same rules.
>
> **Source of truth:** this file mirrors specific entries from Claude's
> project memory at
> `~/.claude/projects/-Users-raju-Local-Sites-dev-app-public-wp-content-plugins-html5-video-player/memory/`.
> That memory is Claude-only and not visible to other tools — this file is
> the plain-text copy so any tool/human reading the repo sees the same rules.
> When Claude adds or updates a memory relevant to this project, it should
> mirror the change here in the same turn. If this file and memory ever
> disagree, memory is more recent — ask Claude to re-sync this file.

## 1. Never break old users, never lose data

For every code change, new feature, or code removal in this plugin:

1. **Existing ("old") users must not face any issues** from the change.
2. **Existing users must not lose any data** — settings, post meta, options,
   post content, block attributes, etc. — as a result of the change.
3. **Free → Pro upgrade must be seamless** — a free user upgrading to Pro must
   not face issues or lose data; anything they created/configured on free
   must carry over cleanly.

**How to apply:**
- Before editing/removing block attributes, option keys, meta keys, or PHP
  class/constant names, check whether a migration is needed (deprecated
  attribute fallbacks, `register_meta` back-compat, an upgrade routine) —
  don't assume a clean rename is safe.
- When renaming/restructuring (see the `H5VP_PRO_*` → `H5VP_*` history
  below), verify old stored data/options under the old keys still resolve or
  are migrated.
- When adding features, make sure existing saved blocks/posts still
  render/save correctly against **old** attribute shapes, not just new ones.
- If a change genuinely can't avoid a breaking migration, say so explicitly
  and flag it — don't ship it silently.

_(Synced from Claude memory: `feedback_backward_compat_data_safety.md`)_

## 2. This is the FREE build — keep it free of premium plumbing

This repo (`html5-video-player`) is the free-only distribution
(`is_premium => false` in the main plugin file). It was converted from a
freemium codebase; the rule going forward is: **no runtime premium checks in
the free build**, but promotional/upgrade UI stays.

**Remove/never add (premium implementation / gating):**
- Premium implementation files (Pro classes, license activation, premium
  integrations, premium models/REST/DB code).
- `can_use_premium_code()` / `is__premium_only()` gating branches in PHP.
- AJAX endpoints that exist solely as premium-status probes, or frontend AJAX
  calls that check premium status.
- `isPremium` runtime checks anywhere in JS/PHP.
- `H5VP_PRO_*`-prefixed constants (use `H5VP_*`).
- Freemius premium flags (`is_premium => true`, `has_premium_version => true`,
  `premium_slug`, etc.) — must stay free-only.

**Keep (promotional UI / marketing — not a "check"):**
- "Upgrade to Pro" admin notices/banners.
- Pro feature lists / `h5vp-pro-notice-box` content blocks.
- ProModal, PremiumText, Upgrade tab components in the editor.
- Dashboard Pricing route, FeatureCompare route, `proFeatures` array.
- "PRO" badges in inspector panels (static labels, not gates).
- Links to bplugins.com pricing pages.

**How to apply:** before deleting copy that mentions premium/pro/upgrade, ask
whether it *implements* a premium feature (remove) or *advertises* one
(keep). When unsure, keep it and ask. If you find a runtime premium check,
actually remove the call/gate — don't leave an "always false" stub.

_(Synced from Claude memory: `feedback_pro_removal_scope.md`)_
