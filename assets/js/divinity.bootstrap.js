/* ========================================================================
 * Divinity: divinity.bootstrao.js
 * Initialises bootstrap components
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

jQuery(document).ready(function($) {
    /********************
     Bootstrap Tooltips
    /*******************/
    $('[data-toggle="tooltip"]').tooltip();

    /********************
     Bootstrap Popovers
    /*******************/
    $('[data-toggle="popover"]').popover();

    /********************
     Progress Bar Indicator
    /*******************/
    $('.progress').each(function() {
        var progress = $(this);
        var value = progress.attr('value');
        progress.parent().find('.progress-indicator').css('left', value + '%');
    });
});
