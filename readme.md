# HTML5 Video Player – Embed and Play Videos in Custom Player

A flexible, fully responsive WordPress video player plugin. Embed MP4, WebM, OGG, FLV, YouTube, and Vimeo videos via shortcode or Gutenberg block — no code required.

- **Version:** 2.11.1
- **Requires WordPress:** 6.5+
- **Requires PHP:** 7.4+ (Pro: 8.1+)
- **License:** GPL v2 or later
- **Plugin page:** https://bplugins.com/products/html5-video-player/
- **Documentation:** https://bplugins.com/docs/html5-video-player/

> This file is for developers working on the plugin. The user-facing, WordPress.org-distributed
> readme (full feature list, FAQ, changelog) is [`readme.txt`](readme.txt).

## Features

- Responsive HTML5 player built on [Plyr](https://plyr.io/)
- Embed via shortcode or Gutenberg block
- Supports MP4, WebM, OGG, FLV, YouTube, and Vimeo
- Autoplay, loop, mute, and preload controls
- Customizable skins, colors, and controls
- Elementor widget support
- Schema markup for SEO

See [`readme.txt`](readme.txt) for the complete feature list and the Free vs. Pro comparison.

## Usage

### Quick Player shortcode

```
[video_player src="https://example.com/video.mp4"]
```

Supported attributes:

```
controls="play-large, restart, rewind, play, fast-forward, progress, current-time, mute, volume, captions, settings, pip, airplay, download, fullscreen"
autoplay="true|false"
muted="true|false"
preload="auto|metadata|none"
width="500px"
reset_on_end="true"
```

### Gutenberg block

Add the **HTML5 Video Player** block in the editor and select a configured player.

### Theme templates

```php
<?php echo do_shortcode( 'YOUR_SHORTCODE' ); ?>
```

## Development

### Requirements

- Node.js (with npm)
- PHP 7.4+ and Composer
- WP-CLI (for i18n tasks)

### Setup

```bash
npm install
composer install
```

### Common scripts

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run start`      | Build assets in watch mode                               |
| `npm run build`      | Production build, generate translations, create zip      |
| `npm run build:windows` | Production build without zipping                      |
| `npm run lint`       | Lint `src` with ESLint                                   |
| `npm run check-types`| Type-check with TypeScript                               |
| `npm run format`     | Format with `wp-scripts format`                          |
| `npm run i18n`       | Generate `.pot`, `.json`, and `.mo` translation files    |
| `npm run zip`        | Build the distributable plugin zip                       |
| `npm test`           | Run Playwright end-to-end tests                          |
| `npm run test:ui`    | Run Playwright tests in UI mode                          |

### Project structure

```
html5-video-player.php   Plugin bootstrap (header, Freemius init)
includes.php             Loads core includes
inc/                     PHP source (Base, Database, Model, Services, Field, Rest, ...)
src/                     JS/TS and editor sources
build/                   Compiled assets (generated)
admin/                   Admin-side assets
tinymce/                 Classic editor integration
languages/               Translation files
public/                  Front-end static assets
vendor/                  Composer dependencies
```

## Releasing

`npm run build` compiles assets, builds translations, and produces `zip/html5-video-player.zip`.
Bump the version in `html5-video-player.php` (plugin header and `H5VP_VER`) and the
`Stable tag` in `readme.txt` before building.

## Support

- Support: https://bplugins.com/support/
- Report security issues via the [Patchstack VDP](https://patchstack.com/database/vdp/9e5fb205-6f66-453b-bdaa-c7c587b83810)
