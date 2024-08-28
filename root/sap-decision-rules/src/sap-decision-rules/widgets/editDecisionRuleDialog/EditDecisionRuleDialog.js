/**
*******************************************************************************
 * User: eeicmsy
 * Date: 04/01/18
/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied
 *******************************************************************************
 * User: eeicmsy
 * Date: 04/01/18
 */
define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    './EditDecisionRuleDialogView',
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

    'template!./_editPmFmForm.xml',
    'template!./_editCommForm.xml',
    'template!./_editScalingPmFmForm.xml'

], function (core, Dictionary, View, Validator, Dialog, InlineMessage, Loader, Form, ajaxService,
        Constants, DialogUtils, HttpConstants, UrlConstants, Utils, FieldValidator, pmfmForm, commForm, scalingPmFmForm) {

    'use strict';

    /**
     * Generic Widget displaying File UpLoad Dialog
     *
     * For Example Install Service Template options in a Dialog Box or Install Plugins
     *
     * Will make a call POST action to upload a user selected file to the server.
     *
     * Can also add form fields to display (name)
     *
     *
     */
    return core.Widget.extend({

        View: View,

        /**
         * Construct generic upload dialog
         * @param options
         *         patchURL        : Address where to upload form, e.g. UrlConstants.serviceTemplates.SERVICES_TEMPLATES_GRID_DATA
         *         eventBus       : eventBus to publish-subscribe to
         *         handleRefresh  : Method that can refresh the grid displaying files (with toast)
         *         dialogHeader   : e.g.  Dictionary.titles.INSTALL_SERVICE_TEMPLATE
         *         fieldValidator : validation for Form Inputs
         */
        init: function (options) {
          this.options = options ? options : {};
          this.patchURL = this.options.patchURL;
          this.handleRefresh = this.options.handleRefresh;
          this.eventBus = this.options.eventBus;
          this.dialogHeader = this.options.dialogHeader;
          this.data = this.options.data;
          this.fieldValidator = new FieldValidator();
        },

        /**
         * Entry point - show a Dialog containing this content
         */
        showEditDecisionRuleDialog: function () {

          var editDialog = new Dialog({
              header: this.dialogHeader,
              content: this,
              topRightCloseBtn: true
          });

          this.parentDialog = editDialog;

          this.setDialogButtonsEditEnabled(false);

          this.parentDialog.show();

          this.addEventHandlers();

          this.selectForm();

          this.checkAssetType();

          var status = this.data.status;
          this.view.setStatusText(status);
          this.view.setStatusDotColor(status);
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
                this.loader.attachTo(this.view.getContentHolder());
            }
        },

        destroyLoadingAnimation: function () {
            if (typeof this.loader !== 'undefined') {
                this.loader.destroy();
                delete this.loader;
            }
        },

        setUpFields: function (parameters){
            this.setSelectedAction("action");
            this.setSelectedAction("alternativeAction");

            this.addFormValidators(parameters);
        },

        setSelectedAction: function(actionType) {
            var selectedActionName = this.data[actionType];
            var fields = this.form.getFields();

            for (var i in fields) {
                var field = fields[i];
                if (field.name === actionType) {
                    var fieldItem = this.getFieldItemWithName(field, selectedActionName);
                    if (fieldItem) {
                        field.input.setValue(fieldItem);
                    }
                }
            }
        },

        getFieldItemWithName: function(field, name) {
            var items = field.input.options.items;
            for (var i in items) {
                var item = items[i];
                if (item.name === name) {
                    return item;
                }
            }
        },

        selectForm: function (){
            Dictionary.inputData = this.data;
            if (((Dictionary.inputData.eventType === "pm") || (Dictionary.inputData.eventType === "PM")) || 
                    ((Dictionary.inputData.eventType === "fm") || (Dictionary.inputData.eventType === "FM"))){
                this.attachFormToEdit(pmfmForm(Dictionary));
            }else{
                this.attachFormToEdit(commForm(Dictionary));
            }
        },

        checkAssetType: function () {
            Dictionary.inputData = this.data;
            if ((Dictionary.inputData.assetType === "vnf") || (Dictionary.inputData.assetType === "VNF")){
                this.form.detach(this.getElement());
                this.attachFormToEdit(scalingPmFmForm(Dictionary));
            }
        },

        attachFormToEdit: function(formContent, eventType) {
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
                if (formFields.hasOwnProperty(f)){
                    var field = formFields[f];
                    if (field.name === Dictionary.get("ACTION_COUNT.name") || field.name === Dictionary.get("TIME_LAPSE.name")) {
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
            var timeLapse =  this.getFieldValue(Dictionary.get("TIME_LAPSE.name"));
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

        sendEditDecisionRuleCall: function (data){
            var loadingMessage = Dictionary.get("loadingMessages.LOADING_CREATING_DECISION_RULE");
            this.parentDialog.hide();
            var onStatusUpdateError = this.onCreateError.bind(this);
            this.updateDecisionRule(data, loadingMessage, onStatusUpdateError);
        },

        updateDecisionRule: function (data, loadingMessage, onStatusUpdateError) {
            this.showLoadingAnimation(true, loadingMessage);
      
            ajaxService.patchCall({
                url: this.patchURL,
                data: JSON.stringify(data),
                contentType: HttpConstants.mediaTypes.CONTENT_TYPE_APPLICATION_JSON,
                dataType: HttpConstants.mediaTypes.JSON,
                success: this.handleCreateSuccess.bind(this),
                error: this.onCreateError.bind(this)
            });
        },

        onCreateError: function (code, response) {
            this.showLoadingAnimation(false);
            if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog(Dictionary.get("forbiddenActionMessages.ACTIVATE_DECISION_RULE"));
            } else {
                var errorHeader = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_ACTIVATE_DECISION_RULE");
                DialogUtils.showError(errorHeader, response);
            }
        },

        save: function(response) {
            var newState = this.editedData(Constants.serverConstants.INACTIVE);      
            if (this.alternativeActionValuesAllSetOrNotSet()) {
                this.formValidator.checkValidity({
                success: function () {
                    this.sendEditDecisionRuleCall(newState);
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

        activate: function(response) {
            var newState = this.editedData(Constants.serverConstants.ACTIVE);
            if (this.alternativeActionValuesAllSetOrNotSet()) {
                this.formValidator.checkValidity({
                 success: function () {
               this.sendEditDecisionRuleCall(newState);
                 }.bind(this),
                 error: function (arr) {
                  var errorFirstLine = Dictionary.get('validate.ALTERNATE_ACTION_ACTIVATE_ERROR'),
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

        editedData: function(status) {
            var data = this.form.getData();

            var editedData = {
                    action: data.primaryAction.action,
                    status: status
            };
            if (data.alternateAction) {
                editedData.actionCount = data.alternateAction.primaryActionCount;
                editedData.alternativeAction = data.alternateAction.alternativeAction;
                editedData.timeLapse = data.alternateAction.timeLapse;
                if ((!editedData.actionCount) && (editedData.alternativeAction === 'None')  && (!editedData.timeLapse)) {
                    editedData = {
                            action: data.primaryAction.action,
                            status: status
                    };
                }
            }
            return editedData;
        },

        handleCreateSuccess: function (response) {
            this.showLoadingAnimation(false);
            this.handleRefresh(Dictionary.get("dialogMessages.UPDATED_DECISION_RULE_SUCCEEDED"));
        },

        /**

         * @param isInstallEnabled
         */
        setDialogButtonsEditEnabled: function (isEditDecisionRuleDialogEnabled) {
            var status = this.data.status;
            if (status === "Inactive") {
                this.parentDialog.setButtons(getDialogButtons(isEditDecisionRuleDialogEnabled, this.parentDialog, this.save.bind(this), this.activate.bind(this)));
            }else {
                this.parentDialog.setButtons(getDialogButtons2(isEditDecisionRuleDialogEnabled, this.parentDialog, this.save.bind(this), this.activate.bind(this)));
            }
        }
    });

    function getDialogButtons(isEditDecisionRuleDialogEnabled, editDialog, save, activate) {      

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
                editDialog.hide();
            }
          }
      ];
    }

    function getDialogButtons2(isEditDecisionRuleDialogEnabled, editDialog, save, activate) { 
        return [
            {
                caption: Dictionary.captions.ACTIVATE,
                color: 'darkBlue',
                action: activate
            },
            {
                caption: Dictionary.captions.CANCEL,
                action: function () {
                    editDialog.hide();
                }
            }
          ];
    }
});
