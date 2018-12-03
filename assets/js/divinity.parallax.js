/* ========================================================================
 * Divinity: divinity.parallax.js
 * Initialises parallax backgrounds
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

jQuery(document).ready(function($) {
    if(window.self !== window.top) {
        // wait for load event if we are in vc's iframe.
        $(window).on('load', function() {
            initParallax();
        });
    } else {
        initParallax();
    }

    /********************
     Parallax Backgrounds
    /*******************/
    function initParallax() {
        $('body:not(.--o--agent-touch) .section-background').parallaxBackground({
            'image': '.section-bg-image-paralax'
        });
    }
});
