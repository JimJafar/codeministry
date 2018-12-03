/* ========================================================================
 * Divinity: divinity.onepage.js
 * Navigation JS
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

/* global Waypoint */

jQuery(document).ready(function($) {
    // Get all #menus and #id sections
    $('.--o--nav-menu').find('a').each(function() {
        var link = this;

        // is this a hash link on this page?
        if(link.hash && window.location.hostname === link.hostname && link.pathname === window.location.pathname) {
            var $link = $(link);
            // Is the scroll to element on the page?
            var scrollToMe = $(link.hash);
            var offsetAttr = $link.attr('data-offset');

            if (scrollToMe.length !== 0) {
                // We have a section and a hash link to it so lets watch for scroll events

                // Check for scrolling top of section in and out
                new Waypoint({
                    element: scrollToMe[0],
                    offset: offsetAttr,
                    handler: function(direction) {
                        $link.parent().toggleClass('active', direction === 'down');
                    }
                });
                // Check for scrolling bottom of section in and out
                new Waypoint({
                    element: scrollToMe[0],
                    offset: offsetAttr - scrollToMe.height(),
                    handler: function(direction) {
                        $link.parent().toggleClass('active', direction !== 'down');
                    }
                });
            }
        }
    });
});
