<?php
/**
 * Plugin Name: Slide-in Animations
 * Description: Adds an option to attach a slide in animation to blocks in Gutenberg as they get visible in the viewport.
 * Version:     1.0.0
 * Author:      Joel Lansgren
 */

// Abort if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load Gutenberg editor dependencies
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_script(
        'transition-fade-in-editor',
        plugin_dir_url( __FILE__ ) . 'editor/index.js',
        [
            'wp-element',
            'wp-components',
            'wp-block-editor',
            'wp-hooks'
        ],
        filemtime( plugin_dir_path( __FILE__ ) . 'editor/index.js' )
    );
});

// Load frontend dependencies
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'transition-fade-in-frontend',
        plugin_dir_url( __FILE__ ) . 'public/transition-fade-in-frontend.js',
        [],
        filemtime( plugin_dir_path( __FILE__ ) . 'public/transition-fade-in-frontend.js' ),
        true
    );
});
