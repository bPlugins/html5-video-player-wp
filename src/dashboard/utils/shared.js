import { __ } from '@wordpress/i18n'

export const slug = 'html5-video-player';

export const gutenbergTabIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='3' width='7' height='7' rx='1' />
    <rect x='14' y='3' width='7' height='7' rx='1' />
    <rect x='3' y='14' width='7' height='7' rx='1' />
    <rect x='14' y='14' width='7' height='7' rx='1' />
</svg>;

export const shortcodeTabIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <polyline points='16 18 22 12 16 6' />
    <polyline points='8 6 2 12 8 18' />
</svg>;

export const elementorTabIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='3' width='18' height='18' rx='2' />
    <line x1='9' y1='9' x2='15' y2='9' />
    <line x1='9' y1='13' x2='15' y2='13' />
    <line x1='9' y1='17' x2='15' y2='17' />
</svg>;



/**
 * The concrete "how do I add a video" instructions for each editor.
 *
 * This is what the editor choice buys the user: instead of generic tips
 * covering every workflow, they get only the three that match how they
 * actually build pages — rendered on the same screen, the moment they choose.
 *
 * @param {string} editor - 'gutenberg' | 'elementor' | 'shortcode'
 */
export const editorGuide = (editor) => {
    const guides = {
        gutenberg: {
            label: __('Adding a video with Gutenberg:', 'html5-video-player'),
            steps: [
                __('Open any post or page and type <strong>/Video Player</strong> to insert the block', 'html5-video-player'),
                __('Add a <strong>Video File</strong>, <strong>YouTube</strong>, or <strong>Vimeo</strong> child block for your source', 'html5-video-player'),
                __('Set autoplay, mute, loop, poster image, and colors in the block sidebar', 'html5-video-player')
            ]
        },
        elementor: {
            label: __('Adding a video with Elementor:', 'html5-video-player'),
            steps: [
                __('Edit a page with Elementor and search for <strong>HTML5 Video Player</strong>', 'html5-video-player'),
                __('Drag the widget into your layout, then pick a player or paste a video URL', 'html5-video-player'),
                __('Use the Style tab for spacing, background, and responsive visibility', 'html5-video-player')
            ]
        },
        shortcode: {
            label: __('Adding a video with a shortcode:', 'html5-video-player'),
            steps: [
                __('Go to <strong>Video Player &rsaquo; Add New Player</strong> and add your video source', 'html5-video-player'),
                __('Publish it, then copy the generated <code>[html5_video id="12"]</code> shortcode', 'html5-video-player'),
                __('Paste that shortcode into any post, page, widget, or template file', 'html5-video-player')
            ]
        }
    };

    // Nothing picked yet — show one route per workflow rather than empty space.
    return guides[editor] || {
        label: __('Not sure yet? These are the three quickest routes:', 'html5-video-player'),
        steps: [
            __('Type <strong>/Video Player</strong> in the block editor to insert the player block', 'html5-video-player'),
            __('Or go to <strong>Video Player &rsaquo; Add New Player</strong> and copy its shortcode', 'html5-video-player'),
            __('Paste that shortcode into any post, page, widget, or template file', 'html5-video-player')
        ]
    };
};