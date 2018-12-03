/* ========================================================================
 * Divinity: divinity.smooth.scroll.js
 * Initialises smooth scrolling to ids classes on page
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

/* global smoothScroll */

jQuery(document).ready(function($) {
    // Do we have smoothScroll?
    if(undefined === smoothScroll) {
        return;
    }

    // Smooth scrolling from a menu click
    $('.--o--nav-smooth-scroll').click(function(event) {
        scrollToMenuLinkHash(event.target);
    });

    // Smooth scrolling from another page
    if (window.location.hash) {
        $('.--o--nav-smooth-scroll').each(function(index, menuLink) {
            if (window.location.href === menuLink.href) {
                scrollToMenuLinkHash(menuLink);
                return false;
            }
        });
    }

    function scrollToMenuLinkHash(link) {
        // Do we have a hash link?
        if (!link.hash) {
            return;
        }

        // Is it on this page?
        if (window.location.hostname !== link.hostname || link.pathname !== window.location.pathname) {
            return;
        }

        // Get the element to scroll to
        var scrollToMe = $(link.hash);

        // Is the scroll to element on the page?
        if (scrollToMe.length === 0) {
            return;
        }
        // Ok we have a has link and something to go to.  Lets scroll to it...smoothly!
        var options = {};
        var offsetAttr = $(link).attr('data-offset');

        if(undefined !== offsetAttr && offsetAttr !== '') {
            options.offset = offsetAttr;
        }
        // scroll to section.
        smoothScroll.animateScroll(scrollToMe[0], null, options);

        // if we are on mobile, close the mobile menu.
        var mobileAttr = $(link).attr('data-mobile');

        if (undefined !== mobileAttr && mobileAttr === 'true') {
            $('#nav-toggle').trigger('click');
        }

        // Prevent regular events.
        event.preventDefault();
        event.stopPropagation();
    }

    /********************
     Smooth Scrolling init
    /*******************/
    smoothScroll.init({
        speed: 500, // Integer. How fast to complete the scroll in milliseconds
        easing: 'easeInOutCubic' // Easing pattern to use
    });
});
