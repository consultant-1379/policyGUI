define([
    'jscore/core',
    'text!./rawMessageCell.html',
    'styles!./rawMessageCell.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        setButtonText: function(text) {
            this.getButton().setText(text);
        },

        getButton: function() {
            return this.getElement().find(".elEsoCommonlib-wRawMessageText-button");
        },

        setColor: function(color) {
            this.getElement().find(".elEsoCommonlib-wRawMessageText-button").setStyle('color', color);
        }
    });
});
