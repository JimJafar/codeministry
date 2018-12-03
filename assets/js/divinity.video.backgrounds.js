/* ========================================================================
 * Divinity: divinity.video.js
 * Initialises video backgrounds
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

/* global video_background */

jQuery(document).ready(function($) {
    /********************
     Background Videos
    /*******************/
    $('.section-background-video').each(function() {
        var $this = $(this);

        var args = {
            'position'   : 'absolute',	 //Stick within the div
            'z-index'    : '-1',		 //Behind everything
            'loop'       : true, 			 //Loop when it reaches the end
            'autoplay'   : true,		 //Autoplay at start
            'start'      : 5,				 //Start with 6 seconds offset (to pass the introduction in this case for example)
            'video_ratio': 1.7778, // width/height -> If none provided sizing of the video is set to adjust
            'priority'   : 'html5'
        };

        // Wrapped around ifs to avoid undefined properties
        if ($this.data('muted')) {
            args.muted = $this.data('muted');
        }
        if ($this.data('youtube')) {
            args.youtube = $this.data('youtube');
        }
        if ($this.data('mp4')) {
            args.mp4 = $this.data('mp4');
        }
        if ($this.data('webm')) {
            args.webm = $this.data('webm');
        }
        if ($this.data('poster')) {
            args.fallback_image = $this.data('poster');
        }
        new video_background($this, args);
    });
});
