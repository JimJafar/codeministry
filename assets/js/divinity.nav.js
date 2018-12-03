/* ========================================================================
 * Divinity: divinity.nav.js
 * Navigation JS
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

/* global Waypoint */

jQuery(document).ready(function($) {
    /********************
     Navigation Drop Downs
    /*******************/
    if (!$('body').hasClass('--o--agent-touch') && $('.--o--nav').hasClass('--o--nav-hover')) {
        $('.--o--nav-menu ul li').on('mouseover', function() {
            $(this).find('.--o--nav-dropdown').removeClass('closed');
        }).on('mouseout', function() {
            $(this).find('.--o--nav-dropdown').addClass('closed');
        });
    } else {
        $('.--o--nav-menu ul li a:not(:only-child)').on('click', function(e) {
            $(this).siblings('.--o--nav-dropdown').toggleClass('closed');
            $('.--o--nav-dropdown').not($(this).siblings()).addClass('closed');
            e.stopPropagation();
            e.preventDefault();
        });
    }

    $('html').click(function() {
        $('.--o--nav-dropdown').addClass('closed');
    });

    $('#nav-toggle').click(function(e) {
        $('.--o--nav-menu .--o--nav-list').slideToggle();
        $('.--o--nav-menu .--o--nav-widget').slideToggle();
        e.preventDefault();
    });

    $('#nav-toggle').on('click', function() {
        this.classList.toggle('active');
    });

    /********************
     Sticky header
    /*******************/
    var $header = $('body').find('.--o--nav-sticky');
    if($header.length > 0) {
        new Waypoint.Sticky({
            element: $header[0],
            stuckClass: '--o--nav-stuck'
        });

        new Waypoint({
            element: document.body,
            offset: -200,
            handler: function(direction) {
                if(direction === 'down') {
                    $header.addClass('--o--nav-scrolled');
                } else {
                    $header.removeClass('--o--nav-scrolled');
                }
            }
        });
    }

    /********************
     Back to top button
    /*******************/
    new Waypoint({
        element: document.body,
        offset: -200,
        handler: function(direction) {
            if(direction === 'down') {
                $('.--o--go-top').removeClass('hide');
            } else {
                $('.--o--go-top').addClass('hide');
            }
        }
    });
    $('.--o--go-top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
    });
});
