define([
    'jscore/core',
    'text!./logDetailsFlyout.html',
    'styles!./logDetailsFlyout.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getTabDiv: function() {
            return this.getElement().find(".eaSapExecutionLog-wDetails-tabs");
        }
    });
});
