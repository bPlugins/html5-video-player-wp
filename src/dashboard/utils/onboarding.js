
import { __ } from '@wordpress/i18n'
import { slug, shortcodeTabIcon, gutenbergTabIcon, elementorTabIcon, editorGuide } from './shared'
/**
 * Guided-setup wizard content.
 *
 * All three editor cards are always offered — a site without Elementor today
 * may install it tomorrow, and the choice only tailors instructions.
 */
export const onboardingInfo = () => [
    {
        key: 'welcome',
        title: __('Welcome to HTML5 Video Player', 'html5-video-player'),
        subtitle: __('Let’s get your first video on the page. It takes about a minute, and everything you set here can be changed later.', 'html5-video-player'),
        // Onboarding-specific clip. Remove this property and the wizard falls
        // back to `media.video` from dashboardInfo — the marketing video on the
        // Welcome page — so nothing breaks if this asset ever goes away.
        video: {
            url: 'https://youtube.com/watch?v=SFQSIOz3D34',
            isYoutube: true,
            title: __('HTML5 Video Player — short tutorial', 'html5-video-player')
        },
        // Free-plan claims only — subtitles and chapters are Pro, so they don't
        // belong on the first screen a free user sees.
        bullets: [
            __('Embed MP4, WebM, and OGG files, or a YouTube or Vimeo link', 'html5-video-player'),
            __('Match the player to your brand with skins and color customization', 'html5-video-player'),
            __('Add players with Gutenberg blocks, the Elementor widget, or a shortcode', 'html5-video-player'),
            __('Responsive, mobile-friendly, and SEO-optimized out of the box', 'html5-video-player')
        ],
        nextLabel: __("Let's Get Started", 'html5-video-player')
    },
    {
        key: 'defaults',
        title: __('Set your player defaults', 'html5-video-player'),
        subtitle: __('Starting points for every new player. You can change all of them later under Video Player › Settings.', 'html5-video-player'),
        skipLabel: __('Skip', 'html5-video-player'),
        fields: [
            {
                type: 'color',
                id: 'primary_color',
                label: __('Brand color', 'html5-video-player'),
                description: __('Accent color for the progress bar and controls', 'html5-video-player'),
                default: '#00b2ff'
            },
            {
                type: 'toggle',
                id: 'pause_others',
                label: __('Play one video at a time', 'html5-video-player'),
                description: __('Starting a player pauses any other playing on the same page', 'html5-video-player'),
                default: false
            },
            {
                type: 'toggle',
                id: 'gutenberg_enable',
                label: __('Use the block editor for new players', 'html5-video-player'),
                description: __('Opens Add New Player in Gutenberg instead of the classic screen', 'html5-video-player'),
                default: true,
                help: {
                    title: __('Block editor for new players', 'html5-video-player'),
                    body: [
                        __('With this on, <strong>Video Player &rsaquo; Add New Player</strong> opens in the Gutenberg block editor. You build the player from blocks — a Video File, YouTube, or Vimeo source — and set its options in the block sidebar.', 'html5-video-player'),
                        __('With it off, new players open in the classic screen instead. Either way the player still gets a shortcode you can paste anywhere.', 'html5-video-player'),
                        __('Which editor a player uses is recorded when that player is created, so changing this later only affects players you add from then on — existing ones keep opening in the editor they were built with.', 'html5-video-player')
                    ]
                }
            }
        ]
    },
    {
        key: 'features',
        title: __("What's included with HTML5 Video Player", 'html5-video-player'),
        subtitle: __('Everything marked Included works right now on the free version. Pro unlocks the rest whenever you need it.', 'html5-video-player'),
        skipLabel: __('Skip', 'html5-video-player'),
        secondaryAction: {
            label: __('Upgrade to Pro', 'html5-video-player'),
            url: `https://bplugins.com/products/${slug}/pricing/`
        },
        // Free/Pro split mirrors the plan matrix at
        // api.bplugins.com/wp-json/bpl/v1/products/14259 — the same source the
        // Feature Comparison page renders. Keep them in step if plans change.
        features: [
            {
                title: __('MP4, WebM & OGG, plus YouTube and Vimeo', 'html5-video-player'),
                badge: __('Included', 'html5-video-player'),
                description: __('Embed a self-hosted file or paste a link — no re-encoding, no third-party account.', 'html5-video-player')
            },
            {
                title: __('Skins & Color Customization', 'html5-video-player'),
                badge: __('Included', 'html5-video-player'),
                description: __('Match the player to your brand, and set autoplay, loop, and mute per video.', 'html5-video-player')
            },
            {
                title: __('Gutenberg, Elementor & Shortcodes', 'html5-video-player'),
                badge: __('Included', 'html5-video-player'),
                description: __('Insert a player with a block, the Elementor widget, or a shortcode anywhere.', 'html5-video-player')
            },
            {
                title: __('Responsive, Mobile & SEO Ready', 'html5-video-player'),
                badge: __('Included', 'html5-video-player'),
                description: __('Adapts to any screen, works across every major browser, and outputs video schema.', 'html5-video-player')
            },
            {
                title: __('Multiple Subtitles & Quality Switcher', 'html5-video-player'),
                badge: __('Pro', 'html5-video-player'),
                locked: true,
                description: __('Multilingual captions, plus YouTube-style resolution and playback speed control.', 'html5-video-player')
            },
            {
                title: __('Chapters, Watermark & Password Protection', 'html5-video-player'),
                badge: __('Pro', 'html5-video-player'),
                locked: true,
                description: __('Timestamp markers, your logo over the video, and gated private content.', 'html5-video-player')
            },
            {
                title: __('And much more', 'html5-video-player'),
                badge: __('Pro', 'html5-video-player'),
                locked: true,
                description: __('Sticky on scroll, popup player, VAST ads, end screens, external hosting, and download control.', 'html5-video-player')
            }
        ]
    },
    // Final step: the choice and its payoff live on one screen. Because `tips`
    // is resolved against live values, the instructions swap the moment a card
    // is picked \u2014 so choosing is immediately worth something rather than
    // sending the user to yet another screen to find out what it did.
    {
        key: 'editor',
        title: __('Last step \u2014 how will you add videos?', 'html5-video-player'),
        subtitle: __('Pick how you usually build pages and the steps below will match. You can still use any of the other methods later.', 'html5-video-player'),
        fields: [
            {
                type: 'choice',
                id: 'editor',
                label: __('Preferred method', 'html5-video-player'),
                options: [
                    {
                        value: 'shortcode',
                        label: __('Shortcode', 'html5-video-player'),
                        icon: shortcodeTabIcon,
                        description: __('Paste [html5_video id="..."] into any post or widget', 'html5-video-player')
                    },
                    {
                        value: 'gutenberg',
                        label: __('Gutenberg', 'html5-video-player'),
                        icon: gutenbergTabIcon,
                        description: __('Insert the Video Player block in the editor', 'html5-video-player')
                    },
                    {
                        value: 'elementor',
                        label: __('Elementor', 'html5-video-player'),
                        icon: elementorTabIcon,
                        description: __('Drag the HTML5 Video Player widget into a section', 'html5-video-player')
                    }
                ]
            }
        ],
        tipsLabel: ({ editor }) => editorGuide(editor).label,
        tips: ({ editor }) => [
            ...editorGuide(editor).steps,
            __('Visit <strong>Video Player &rsaquo; Demo & Help</strong> any time for live demos', 'html5-video-player')
        ]
    }
];