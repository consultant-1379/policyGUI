/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: eeicmsy
 * Date: 08/12/17
 */
define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    '../../widgets/formInput/FormInputWidget',
    "eso-commonlib/Constants",
    "eso-commonlib/Utils"
], function (core, Dictionary, FormInputWidget, Constants, Utils) {
    'use strict';

    return core.Region.extend({


        /**
         * Start region with static form items
         * (ones that will always be there - not loaded from policy inputs for example)
         * options :
         *       parameters : static part of form
         */
        onStart: function () {

            this.staticParameters = this.options.staticParameters;
            this.setParameters(this.options.staticParameters);
        },

        onStop: function () {

            delete this.staticParameters;
            this.tearDownFormWidget();
        },


        tearDownFormWidget: function () {
            if (this.formWidget) {
                this.formWidget.detach();
                this.formWidget.destroy();

                delete this.formWidget;
            }
        },

        /**
         * Sets up form with dynamic part of form, replace anything prevously
         * displayed - (keeping the static data first)
         *
         * @param parameters
         */
        setParameters: function (parameters) {

            var existingData;

            /* replacing whole form so keep any thing set from static part of form */
            if (this.formWidget) {
                existingData = this.keepStaticData(this.formWidget.getData());
            }

            this.tearDownFormWidget();

            var allParams = Utils.mergeObjects(this.staticParameters, parameters);

            this.formWidget = this.createFormInputWidget(allParams);

            if (existingData) {
                this.formWidget.setData(existingData);
            }
            this.attachFormWidget();
        },

        /* extracted for unit test */
        createFormInputWidget: function (allParams) {
            return new FormInputWidget({
                    parameters: allParams,
                    staticParameters : this.staticParameters
                });
        },

        /* extracted for unit test */
        attachFormWidget : function(){
            this.formWidget.attachTo(this.getElement());
        },

        /* extracted for unit test */
        getFormWidget : function(){
             return this.formWidget;
        },


        // (NEED TO CLEAR EXISTING parameters when change select box items)
        keepStaticData: function (data) {
            var keptData = {};
            for (var key in data) {
                if (this.staticParameters.hasOwnProperty(key)) {
                    keptData[key] = data[key];
                }
            }
            return keptData;

        },

        getData: function () {
            return this.formWidget.getData();
        },

        /**
         *  Public method for print, copy to clipboard
         *  Noting this will be displayed to user (i.e. can not show passwords, etc)
         *
         * @returns {{}}  displayable representation of data (JSON)
         */
        getDataForDisplayToUser: function () {

            var formData =  this.getData();

            /* it is dynamic fields names from server mostly
               so can not do much in the way of internationalisation,
               but do have to limit what display (e.g. passwords0
             */
            if (formData[Constants.serverConstants.PASSWORD]){
                formData[Constants.serverConstants.PASSWORD] = Dictionary.dialogMessages.SUBMIT_HIDDEN_TEXT;
            }
            return formData;

        },

        isValid: function (successFunction) {
            return this.formWidget.isValid(successFunction);
        },

        isFormBeingEdited: function () {
            return (this.formWidget) ? this.formWidget.isFormBeingEdited() : false;
        }

    });

});
