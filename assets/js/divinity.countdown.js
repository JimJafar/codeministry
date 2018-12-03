/* ========================================================================
 * Divinity: divinity.countdown.js
 * Initialises countdown timer
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

jQuery(document).ready(function($) {
    if(window.self !== window.top) {
        // wait for load event if we are in vc's iframe.
        $(window).on('load', function() {
            initCountdown();
        });
    } else {
        initCountdown();
    }

    /********************
     Countdown Timer
    /*******************/
    function initCountdown() {
        $('.countdown-clock').each(function() {
            var countdown = $(this);
            var date = countdown.attr('data-date');

            countdown.countdown(date).on('update.countdown', function(event) {
                $(this).find('.counter-days').html(event.offset.totalDays);
                $(this).find('.counter-hours').html(event.offset.hours);
                $(this).find('.counter-minutes').html(event.offset.minutes);
                $(this).find('.counter-seconds').html(event.offset.seconds);
            });
        });
    }
});
