/* ========================================================================
 * Divinity: divinity.contact.js
 * Calls PHPMailer from contact form.
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

jQuery(document).ready(function($) {
    // bind submit handler to form
    $('.contact-form').on('submit', function(e) {
        var $form = $(this);
        var $submitButton = $form.find('.btn');
        var $messageContainer = $form.find('.oxy-messages');
        // prevent native submit
        e.preventDefault();
        e.stopPropagation();
        // submit the form
        $form.ajaxSubmit({
            type: 'post',
            dataType: 'json',
            beforeSubmit: function() {
                // disable submit button
                $submitButton.attr('disabled', 'disabled');
            },
            success: function(response, status, xhr, form) {
                if('ok' === response.status) {
                    // mail sent ok - display sent message
                    for(var msg in response.messages) {
                        showInputMessage(response.messages[msg], 'success', $messageContainer);
                    }
                    // clear the form
                    form[0].reset();
                } else {
                    for(var error in response.messages) {
                        showInputMessage(response.messages[error], 'danger', $messageContainer);
                    }
                }
                // make button active
                $submitButton.removeAttr('disabled');
            },
            error: function(response) {
                for(var error in response.messages) {
                    showInputMessage(response.messages[error], 'warning', $messageContainer);
                }
                // make button active
                $submitButton.removeAttr('disabled');
            }
        });
        return false;
    });

    function showInputMessage(message, status, messageContainer) {
        messageContainer.empty();
        messageContainer.append('<div class="alert alert-' + status + ' alert-dismissable fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message.message + '</div>');
    }
});
