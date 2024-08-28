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
 */
define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    'uit!./CreateDecisionRulesDialog.html',
    'formvalidator/Validator',

    'widgets/Dialog',
    'widgets/InlineMessage',
    'widgets/Loader',
    'layouts/Form',

    'eso-commonlib/AjaxService',
    'eso-commonlib/Constants',
    'eso-commonlib/DialogUtils',
    'eso-commonlib/HttpConstants',
    'eso-commonlib/UrlConstants',
    'eso-commonlib/Utils',
    'eso-commonlib/FieldValidator',
    'template!./_createPmForm.xml',
    'template!./_createCommForm.xml',
    'template!./_createFmForm.xml',
    'template!./_createScalingPmForm.xml',
    'template!./_createScalingFmForm.xml'

], function (core, Dictionary, View, Validator, Dialog, InlineMessage, Loader, Form, ajaxService, Constants,
        DialogUtils, HttpConstants, UrlConstants, Utils, FieldValidator, pmForm, commForm, fmForm, scalingPmForm, scalingFmForm) {
    'use strict';

    /**
     * Generic Widget displaying File UpLoad Dialog.
     *
     * For Example Install Service Template options in a Dialog Box or Install Plugins
     *
     * Will make a call POST action to upload a user selected file to the server.
     *
     * Can also add form fields to display (name)
     *
     */

    return core.Widget.extend({

        /**
         * Construct generic upload dialog
         * @param options
         *     postURL    : Address where to upload form, e.g. UrlConstants.serviceTemplates.SERVICES_TEMPLATES_GRID_DATA
         *     eventBus       : eventBus to publish-subscribe to
         *     handleRefresh  : Method that can refresh the grid displaying files (with toast)
         *     dialogHeader   : e.g.  Dictionary.titles.INSTALL_SERVICE_TEMPLATE
         *     fieldValidator : validation for Form Inputs
         */
        init: function (options) {
            this.options = options ? options : {};
            this.postURL = this.options.postURL;
            this.handleRefresh = this.options.handleRefresh;
            this.eventBus = this.options.eventBus;
            this.dialogHeader = this.options.dialogHeader;
            this.fieldValidator = new FieldValidator();
        },

        view: function () {
            return new View(Utils.mergeObjects());
        },

        /**
         * Entry point - show a Dialog containing this content
         */
        showDecisionRulesDialog: function () {

            var decisionRuleDialog = new Dialog({
                header: this.dialogHeader,
                content: this,
                topRightCloseBtn: true
            });

            this.parentDialog = decisionRuleDialog;

            this.setDialogButtonsInstallEnabled(false);

            this.parentDialog.show();

            this.addEventHandlers();

            this.createFormAndAttach(pmForm(Dictionary), "PM");
        },

        /**
         * Method that will be called when the view is rendered
         */
        onViewReady: function () {
        },

        addEventHandlers: function () {
            this.hideHandlerEventId = this.parentDialog.addEventHandler("hide", this.cleanUpOnCloseAction.bind(this));
        },

        removeEventHandlers: function () {
            if (this.parentDialog) {
                this.parentDialog.removeEventHandler(this.hideHandlerEventId);
                delete this.hideHandlerEventId;
                delete this.parentDialog;
            }
        },

        cleanUpOnCloseAction: function () {
            this.destroy();
        },

        onDestroy: function () {
            this.removeEventHandlers();
        },

        switchWindow: function (element, f) {
            var curEventHandlerid = element.input.addEventHandler("change", function () {
                element.input.removeEventHandler(curEventHandlerid);
                if (element.input.getValue().value.toUpperCase() === "COMM"){
                    this.form.detach(this.getElement());
                    this.createFormAndAttach(commForm(Dictionary), "COMM");
                } else if (element.input.getValue().value === "PM"){
                    this.form.detach(this.getElement());
                    this.createFormAndAttach(pmForm(Dictionary), "PM");
                } else if (element.input.getValue().value === "FM"){
                    this.form.detach(this.getElement());
                    this.createFormAndAttach(fmForm(Dictionary), "FM");
                }
            }.bind(this));
        },

        checkAssetTypeValue: function (element, asset, f){
            var curAssetHandlerid = asset.input.addEventHandler("change", function () {
                asset.input.removeEventHandler(curAssetHandlerid);
                if (asset.input.getValue().value.toUpperCase() === "VNF"){
                    this.form.detach(this.getElement());
                    if (element.input.getValue().value === "PM"){
                        this.createFormAndAttach(scalingPmForm(Dictionary), "PM");
                    } else if (element.input.getValue().value === "FM"){
                        this.createFormAndAttach(scalingFmForm(Dictionary), "FM");
                    }
                } else if (asset.input.getValue().value === "VM"){
                    this.form.detach(this.getElement());
                    if (element.input.getValue().value === "PM"){
                        this.createFormAndAttach(pmForm(Dictionary), "PM");
                    } else if (element.input.getValue().value === "FM"){
                        this.createFormAndAttach(fmForm(Dictionary), "FM");
                    }
                }
            }.bind(this));
        },

        setUpFields: function (parameters){
            var fields = this.form.getFields();
            var element = fields[0],
            asset = fields[1],
            f = this.form;
            this.switchWindow(element, f);
            this.checkAssetTypeValue(element, asset, f);
            this.addFormValidators(parameters);
        },

        createFormAndAttach: function(formContent, eventType) {
            this.form = this.createForm({
                content: formContent
            });
            this.setUpFields();
            this.form.attachTo(this.getElement());
            this.eventType = eventType;
        },

        createForm: function(content) {
            return new Form(content);
        },

        addFormValidators: function(parameters) {
            this.formValidator = new Validator();
            var formFields = this.form.getFields();
            for (var f in formFields) {
                if (formFields.hasOwnProperty(f)) {
                    var field = formFields[f];
                    if (field.name === Dictionary.get("TENANT_NAME.name") || field.name === Dictionary.get("METER_NAME.name")) {
                        this.formValidator.addField(field.iid, {
                            element: field.input,
                            validation: {
                                validate: this.fieldValidator.alphaNumericValidationFunction.bind(this)
                            }
                        });
                    } else if (field.name === Dictionary.get("ACTION_COUNT.name") || field.name === Dictionary.get("TIME_LAPSE.name")) {
                        this.formValidator.addField(field.iid, {
                            element: field.input,
                            validation: {
                                validate: this.fieldValidator.numericValidationOrBlankFunction.bind(this)
                            }
                       });
                   }
               }
            }
        },

        alternativeActionValuesAllSetOrNotSet: function () {
            var actionCountValue = this.getFieldValue(Dictionary.get("ACTION_COUNT.name"));
            var timeLapse = this.getFieldValue(Dictionary.get("TIME_LAPSE.name"));
            var alternativeAction = this.getAlternativeActionValue();
            if (!actionCountValue && !timeLapse && (alternativeAction === "None")) {
                return true;
            } else {
                return (actionCountValue && timeLapse && (alternativeAction !== "None"));
            }
        },

        getFieldValue: function (fieldName) {
            var formFields = this.form.getFields();
            for (var ix in formFields) {
                if (formFields.hasOwnProperty(ix)){
                    var field = formFields[ix];
                    if (field.name === fieldName) {
                        return (field) ? field.input.getValue() : undefined;
                    }
                }
            }
        },

        getAlternativeActionValue: function() {
            var alternativeAction = this.getFieldValue(Dictionary.get("ALT_ACTION.name"));
            return (alternativeAction) ? alternativeAction.value : "None";
        },

        /**

         * @param isDecisionRuleDialogEnabled
         */
        setDialogButtonsInstallEnabled: function (isDecisionRuleDialogEnabled) {
            this.parentDialog.setButtons(getDialogButtons(isDecisionRuleDialogEnabled, this.parentDialog, this.save.bind(this), this.activate.bind(this)));
        },

        /* Loading life cycle */

        /**
         * This loading animation shall block out the whole page
         * whilst install is on-going (no access to top section buttons)
         *
         * @param isShow - if true the loader is displayed, otherwise it is destroyed
         */
        showLoadingAnimation: function (isShow, message) {
            if (isShow) {
                this.createLoadingAnimation(message);
            } else {
                this.destroyLoadingAnimation();
            }
            // underneath this dialog also
            this.eventBus.publish(Constants.events.LOADING_EVENT, isShow, message);
        },

        createLoadingAnimation: function (message) {
            if (typeof this.loader === 'undefined') {
                    this.loader = new Loader({
                    loadingText: message
                });
                this.loader.attachTo(this.getContentHolder());
            }
        },

        destroyLoadingAnimation: function () {
            if (typeof this.loader !== 'undefined') {
                this.loader.destroy();
                delete this.loader;
            }
        },

        /* DOM interaction */

        getContentHolder: function () {
            return this.findElementByClassName("-content");
        },

        getInlineMessageHolder: function () {
            return this.findElementByClassName("-inlineMessageHolder");
        },

        activate: function(response) {
            var activate_data = this.getCreateData(Constants.serverConstants.ACTIVE);

            if (this.alternativeActionValuesAllSetOrNotSet()) {
                this.formValidator.checkValidity({
                    success: function () {
                        this.createDecisionRule(activate_data);
                    }.bind(this),
                    error: function (arr) {
                        var errorFirstLine = Dictionary.get('validate.ACTIVATE_ERROR'),
                        errorSecondLine = Dictionary.get('validate.ERROR_SECOND_LINE'),
                        errorHeader = Dictionary.get('validate.ALTERNATE_ACTION_HEADER');
                        DialogUtils.showMultiLineErrorAlert(errorFirstLine, errorSecondLine, errorHeader);
                    }
                });
            } else {
                var errorFirstLine = Dictionary.get('validate.ALTERNATE_ACTION_ACTIVATE_ERROR'),
                errorSecondLine = Dictionary.get('validate.ALTERNATE_ACTION_SECOND_LINE'),
                errorHeader = Dictionary.get('validate.ALTERNATE_ACTION_HEADER');
                DialogUtils.showMultiLineErrorAlert(errorFirstLine, errorSecondLine, errorHeader);
            }
        },

        createDecisionRule: function (data) {
            this.showLoadingAnimation(false);
            this.parentDialog.hide();
            var onStatusUpdateError = this.onCreateError.bind(this);

            this.sendCreatePostRequest(data, onStatusUpdateError);
        },

        // TO DO - MAKE GENERIC
        getCreateData: function(status) {
            var data = this.form.getData();
            var userName = Utils.getUserName();
            var createData = {
                severity: data.severity,
                severityEvaluation: data.severityEvaluation,
                action: data.primaryAction.action,
                assetType: data.assetType,
                eventType: data.eventType,
                meterName: data.meterName,
                tenantName: data.tenantName,
                status: status,
                createdBy: userName
            };
            if (data.alternateAction) {
                createData.actionCount = data.alternateAction.primaryActionCount;
                createData.alternativeAction = data.alternateAction.alternativeAction;
                createData.timeLapse = data.alternateAction.timeLapse;
                if ((!createData.actionCount) && (createData.alternativeAction === 'None')  && (!createData.timeLapse)) {
                    createData = {
                        severity: data.severity,
                        severityEvaluation: data.severityEvaluation,
                        action: data.primaryAction.action,
                        assetType: data.assetType,
                        eventType: data.eventType,
                        meterName: data.meterName,
                        tenantName: data.tenantName,
                        status: status,
                        createdBy: userName
                    };
                }
            }
            return createData;
        },

        sendCreatePostRequest: function (data, onStatusUpdateError) {
            var loadingMessage = Dictionary.get("loadingMessages.LOADING_CREATING_DECISION_RULE");
            this.showLoadingAnimation(true, loadingMessage);

            var eventType = (this.eventType) ? this.eventType : "PM";

            ajaxService.postCall({
                url: UrlConstants.decision.DECISION_GRID_DATA + "/" + eventType,
                data: JSON.stringify(data),
                contentType: HttpConstants.mediaTypes.CONTENT_TYPE_APPLICATION_JSON,
                dataType: HttpConstants.mediaTypes.JSON,
                success: this.handleCreateSuccess.bind(this),
                error: this.onCreateError.bind(this)
            });
        },

        save: function(response) {
            var saved_status = this.getCreateData(Constants.serverConstants.INACTIVE);
            if (this.alternativeActionValuesAllSetOrNotSet()) {
                this.formValidator.checkValidity({
                    success: function () {
                        this.createDecisionRule(saved_status);
                    }.bind(this),
                    error: function (arr) {
                        var errorFirstLine = Dictionary.get('validate.ALTERNATE_ACTION_SAVE_ERROR'),
                        errorSecondLine = Dictionary.get('validate.ERROR_SECOND_LINE'),
                        errorHeader = Dictionary.get('validate.ALTERNATE_ACTION_HEADER');
                        DialogUtils.showMultiLineErrorAlert(errorFirstLine, errorSecondLine, errorHeader);
                    }
                });
            } else {
                var errorFirstLine = Dictionary.get('validate.ALTERNATE_ACTION_SAVE_ERROR'),
                errorSecondLine = Dictionary.get('validate.ALTERNATE_ACTION_SECOND_LINE'),
                errorHeader = Dictionary.get('validate.ALTERNATE_ACTION_HEADER');
                DialogUtils.showMultiLineErrorAlert(errorFirstLine, errorSecondLine, errorHeader);
            }

        },

        handleCreateSuccess: function (response) {
            this.showLoadingAnimation(false);
            this.handleRefresh(Dictionary.get("dialogMessages.CREATE_DECISION_RULE_SUCCEEDED"));
        },

        onCreateError: function (code, response) {
            this.showLoadingAnimation(false);
            if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog(Dictionary.get("forbiddenActionMessages.ACTIVATE_DECISION_RULE"));
            }
            else if (DialogUtils.alreadyExistsError(response)){
                var errHead = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_SAVE_DECISION_RULE");
                var errorMessage = Dictionary.get("dialogMessages.FAILED_DECISION_RULE_MESSAGE");
                DialogUtils.showMultiLineErrorAlert(errorMessage, "", errHead);
            } else {
                var errorHeader = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_ACTIVATE_DECISION_RULE");
                DialogUtils.showError(errorHeader, response);
            }
        },

        /**
         * Adding prefix present on all divs in the widget's html
         * @param suffix   - end of the name
         * @returns {*}
         */
        findElementByClassName: function (suffix) {
            return this.getElement().find(".eaSapDecisionRules-wDecisionRuleDialog" + suffix);
        }
    });

    function getDialogButtons(isDecisionRuleDialogEnabled, decisionRuleDialog, save, activate) {

    return [
        {
            caption: Dictionary.captions.SAVE,
            color: 'darkBlue',
            action: save
        },
        {
            caption: Dictionary.captions.ACTIVATE,
            color: 'darkBlue',
            action: activate
        },
        {
            caption: Dictionary.captions.CANCEL,
            action: function () {
                decisionRuleDialog.hide();
            }
        }
        ];
    }
});
