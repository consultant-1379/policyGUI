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
 * User: EEICMSY
 * Date: 11/28/18
 */

define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    'eso-commonlib/Utils'
], function (core, Dictionary, Utils) {
    'use strict';


    /**
     * Class to help with general validation functionality
     * with REGEX and callback functions for Forms
     */
    return  core.AppContext.extend({

        /**
         * Dynamic free text check
         * Specifically exclude anything that could be used to create
         * javascript or cause form not to compile
         *
         * ref : arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/jscore/latest/guidelines/security/xss.html
         * @param value
         * @returns {boolean}
         */
        validateSupportedByForm: function (value) {

            return /^[^<>%*&]*$/.test(value);    // NOT allowed these characters  (caution maintain with #getSupportedByFormPattern)

        },

        /**
         * Validation method for text in static part of forms - that shows error message if fails
         * Do not allow characters that could be used to insert javascript into text, etc
         *
         * @param field              Form field   : KNOWN to be a String like a name
         * @param callbacks          promise
         *
         */

        alphaNumericValidationFunction: function (field, callbacks) {
            if (typeof field.getValue().value !== "boolean") {
                if (field.getValue() === "") {
                    callbacks.error(Dictionary.get("validate.EMPTY_MANDATORY_FIELD"));
                } else if (/^[a-zA-Z0-9_-]*[*]?$/.test(field.getValue())) {
                    callbacks.success();
                } else {
                    callbacks.error(Dictionary.get("validate.VALIDATION_INVALID_CHARACTERS"));
                }
            } else {
                callbacks.success();
            }
        },

        /**
         * Validation method for numeric values in static part of forms - that shows error message if fails
         * Do not allow non numeric characters or 0
         *
         * @param field              Form field   : KNOWN to be a numeric value
         * @param callbacks          promise
         *
         */

        numericValidationOrBlankFunction: function (field, callbacks) {
            // If value is not a number, then NaN is returned which is not > 0
            var val = field.getValue();
            if ((val === "") || (Number(val > 0))) {
                callbacks.success();
            } else {
                callbacks.error(Dictionary.get("validate.NUMERIC_CHARACTERS_ONLY"));
            }
        }

    });
});