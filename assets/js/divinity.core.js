/* ========================================================================
 * Divinity: divinity.core.js
 * Essential functions for divinity
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

 /* global Waypoint Pace */

jQuery(document).ready(function($) {
    /********************
     LOACALIZED DATA
    /*******************/
    var theme = window.theme || {
        siteLoader: 'on'
    };
    /********************
     IOS Classes
    /*******************/
    // Assign the 'oxy-agent' class when not assigned by PHP - for the html Version
    if ($('body').not('.--o--agent-iphone') && (/iPhone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        $('body').addClass('--o--agent-iphone');
    }
    if ($('body').not('.--o--agent-ipad') && (/iPad/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        $('body').addClass('--o--agent-ipad');
    }
    // Check for touch device
    if ($('body').not('.--o--agent-touch') && ('ontouchstart' in window || navigator.msMaxTouchPoints)) {
        $('body').addClass('--o--agent-touch');
    }

    /********************
     IE Classes
    /*******************/
    // Check for IE (version 6-11)
    if (navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0) {
        $('body').addClass('--o--agent-explorer');
    }
    // Check for Edge
    if (window.navigator.userAgent.indexOf('Edge') > -1) {
        $('body').addClass('--o--agent-edge');
    }

    /********************
     Object Fit Fix For IE in Card Images
    /*******************/
    $('body.--o--agent-explorer, body.--o--agent-edge').find('.card-horizontal .card-img').each(function() {
        var image = $(this);
        var imageSrc = image.attr('src');
        image.parent('.card-img-container').css('background-image', 'url(' + imageSrc + ')');
    });

    /********************
     Expanding Icon Animation (see social networks)
    /*******************/
    $('.--o--icon-set-expandable a').on('click', function(e) {
        if(!$(this).hasClass('--o--icon-set-item-action')) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).parent('.--o--icon-set-expandable').toggleClass('open');
    });

    /********************
     On scroll animations
    /*******************/
    function onScrollInit(items) {
        items.each(function() {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-os-animation'),
                osAnimationDelay = osElement.attr('data-os-animation-delay');

            osElement.css({
                '-webkit-animation-delay':  osAnimationDelay,
                '-moz-animation-delay':     osAnimationDelay,
                'animation-delay':          osAnimationDelay
            });

            new Waypoint({
                element: osElement[0],
                handler: function() {
                    $(this.element).addClass('animated').addClass(osAnimationClass);
                },
                offset: '90%'
            });
        });
    }

    /********************
     Pace Loading Screen
    /*******************/
    window.paceOptions = {
        startOnPageLoad: theme.siteLoader === 'on',
        restartOnRequestAfter: false
    };

    Pace.on('done', function() {
        setTimeout(function() {
            // When loader has finished start the scroll animations.
            onScrollInit($('.--o--os-animation'));
        }, 500);
    });
});
