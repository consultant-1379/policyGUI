/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2019
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: EEICMSY
 * Date: 2/14/19
 */
define([
    "jscore/core",
    'i18n!eso-commonlib/dictionary.json',
    'uit!./CopyrightNotice.html',
    'eso-commonlib/Utils'
    
], function (core, Dictionary, View, Utils) {
   
    /**
     * Formal Legal Notice and Copyright
     * (as login is though a 3pp (Keycloak),
     * this warning can no longer be part of login process)
     */
    
    return core.Widget.extend({ 
    
        /**
         * constructor
         * @param options  okButtonAction : caller related actions to
         *                                  perform when press ok button on this widget
         */
        init: function (options) {
            this.options = (options) ? options : {};

            this.okButtonAction = this.options.okButtonAction;
        },
        
        view: function () {

            return new View({

                COPYRIGHT_LEGAL_NOTICE_HEADER: Dictionary.dialogMessages.COPYRIGHT_LEGAL_NOTICE_HEADER,
                COPYRIGHT_LEGAL_NOTICE_CONTENT: Dictionary.dialogMessages.COPYRIGHT_LEGAL_NOTICE_CONTENT,
                COPYRIGHT_MESSAGE: Dictionary.dialogMessages.COPYRIGHT_MESSAGE,
                OK: Dictionary.captions.OK

            });
        },
        
        onViewReady: function () {
            this.addActionListeners();

        },

        onDestroy: function () {
            this.removeActionListeners();
        },
        
        addActionListeners: function () {
            var okButton = this.getOkButton();

            if (okButton && (!Utils.isDefined(this.okButtonEventId))) {

                this.okButtonEventId = okButton.addEventHandler("click", this.performActionAndHideNotice.bind(this));
            }
        },

        removeActionListeners: function () {
            var okButton = this.getOkButton();

            if (okButton && Utils.isDefined(this.okButtonEventId)) {

                okButton.removeEventHandler(this.okButtonEventId);
            }
        },
        
        /**
         * Perform action from options
         * Hide screen once user presses button
         */
        performActionAndHideNotice: function () {
            this.detach();
            this.destroy();
            this.okButtonAction();   // perform action from options

        },
        
        /* DOM interaction */

        getOkButton: function () {
            return this.findElementByClassName("-okButton");
        },

        /**
         * Adding prefix present on all divs in the widget's html
         * @param suffix   - end of the name
         * @returns {*}
         */
        findElementByClassName: function (suffix) {
            return this.getElement().find(".eaSapExecutionLog-wCopyrightNotice" + suffix);
        }
    });
    
});