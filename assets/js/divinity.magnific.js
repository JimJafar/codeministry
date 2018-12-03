/* ========================================================================
 * Divinity: divinity.magnific.js
 * Initialises magnific popups
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

jQuery(document).ready(function($) {
    /********************
     Magnific Image Popup
    /*******************/
    $('.magnific').each(function() {
        var myimage = $(this);
        var imageTitle = '';

        if ($(this).data('captions') !== undefined) {
            imageTitle = $(this).data('captions');
        }

        myimage.magnificPopup({
            type:'image',
            removalDelay: 300,
            items: {
                src: myimage.attr('href'),
                title: imageTitle
            },
            mainClass: 'mfp-fade'
        });
    });

    /********************
     Magnific Video Popup
    /*******************/
    $('.magnific-youtube, .magnific-vimeo, .magnific-gmaps').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 300,
        preloader: false,
        fixedContentPos: false
    });

    /********************
     Magnific Audio Popup
    /*******************/
    $('.magnific-audio').each(function() {
        var myUrl = $(this);

        myUrl.magnificPopup({
            items: {
                src: '<div class="audio-popup">'+
                         '<audio controls>'+
                             '<source src="' + myUrl.attr('href') + '" type="audio/mpeg">'+
                         '</audio>'+
                     '</div>',
                type: 'inline'
            }
        });
    });

    /********************
     Magnific Gallery Popup
    /*******************/
    $('.magnific-gallery').each(function() {
        var gallery = $(this);
        var galleryImages = $(this).data('links').split(',');
        var galleryTitle = '';

        if ($(this).data('captions') !== undefined) {
            galleryTitle = $(this).data('captions').split(',');
        }

        var items = [];
        for(var i = 0; i < galleryImages.length; i++) {
            items.push({
                src:galleryImages[i],
                title:galleryTitle[i]
            });
        }
        gallery.magnificPopup({
            mainClass: 'mfp-fade',
            items:items,
            gallery:{
                enabled:true,
                tPrev: $(this).data('prev-text'),
                tNext: $(this).data('next-text')
            },
            type: 'image'
        });
    });
});
