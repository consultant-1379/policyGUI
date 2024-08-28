define([
    'jscore/core',
    'text!./EditDecisionRuleDialog.html',
    'styles!./EditDecisionRuleDialog.less',
    'eso-commonlib/Constants'
], function (core, template, styles, Constants) {
    'use strict';

    return core.View.extend({

    getTemplate: function () {
        return template;
    },

    getStyle: function () {
        return styles;
    },

    getContentHolder: function () {
        return this.findElementByClassName("-content");
    },
    /**
     * Adding prefix present on all divs in the widget's html
     * @param suffix   - end of the name
     * @returns {*}
     */
    findElementByClassName: function (suffix) {
        return this.getElement().find(".eaSapDecisionRules-wEditDecisionRuleDialog" + suffix);
    },

    setStatusText: function(text) {
        var element = this.getElement().find(".eaSapDecisionRules-wEditDecisionRuleDialog-statusText");
        element.setText(text);
    },

    setStatusDotColor: function(status) {
        var color = (status === Constants.serverConstants.ACTIVE) ? "green" : "red";
        var prefix = "ebBgColor";
        var element = this.getElement().find(".eaSapDecisionRules-wEditDecisionRuleDialog-statusDot");

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
