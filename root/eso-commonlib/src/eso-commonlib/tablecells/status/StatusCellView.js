define([
    'jscore/core',
    'text!./statusCell.html',
    'styles!./statusCell.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        setText: function(text) {
            var element = this.getElement().find(".elEsoCommonlib-wStatusText-text");
            element.setText(text);
        },

        setStatusDotColor: function(color) {
            var modifier = color.modifier;
            var prefix = "ebBgColor";
            var element = this.getElement().find(".elEsoCommonlib-wStatusText-dot");

            // remove all modifiers that have been set previously
            if (this._activeColor) {
                element.removeModifier(this._activeColor.modifier, this._activeColor.prefix);
            }

            this._activeColor = {
                modifier: color,
                 prefix: prefix
            };
            element.setModifier(color, "", prefix);
        }
    });
});
