/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: eeicmsy
 * Date: 20/02/18
 */
define([
    "tablelib/Cell",
    "jscore/core"
], function (Cell, core) {

    var SPACE = "&nbsp;&nbsp;&nbsp;&nbsp;";

    /**
     * Adding any special handling may wish for values pass (use Constants class if more)
     */
    return Cell.extend({

        setValue: function (value) {

            var element = new core.Element();

            if (value && value.toString().toUpperCase() === 'TRUE'){
                this.getHTMLElement(element).append(this.createDivElement("ebIcon ebIcon_simpleGreenTick", "" + value));
            } else {
                value = this.getHTMLElement(element);
            }

            this.getElement().append(element);
        },

        /**
         * This is all an effort to avoid using innerHTML directly to avoid XSS
         * @param classValue
         * @param divText
         * @returns {*}
         */
        createDivElement: function (classValue, divText) {
            var divElement = new core.Element('div');
            var iElement = new core.Element('em');
            iElement.setAttribute('class', classValue);
            iElement.setAttribute("style", "margin-right:15px");
            divElement.append(iElement);

            this.getHTMLElement(divElement).append(divText);
            return this.getHTMLElement(divElement);
        },

        /* for junit over-ride when run in console */
        getHTMLElement: function (element) {
            return element.getNative();
        }

    });
});
