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
 * Date: 10/01/18
 */
define([
     'jscore/core',
     'i18n!eso-commonlib/dictionary.json',
     'container/api',

     'eso-commonlib/AjaxService',
     'eso-commonlib/Constants',
     'eso-commonlib/HttpConstants',
     'eso-commonlib/UrlConstants',
     'eso-commonlib/DialogUtils',
     '../../widgets/editDecisionRuleDialog/EditDecisionRuleDialog',
     '../../columns/DecisionColumnAttributes'

], function (core, Dictionary, container, ajaxService, Constants, HttpConstants, UrlConstants, DialogUtils, EditDecisionRuleDialog, DecisionColumnAttributes) {
     'use strict';

     /**
      * This class handling actions for when
      * select top section options for the App
      * when row or row selected (context actions)
      *
      * (e.g. Delete or Activate)
      *
      * Note: The Default option(s) when nothing is selected is in
      * this.getDecisionRegion().getDefaultActions()
      */

     return core.AppContext.extend({

     /**
      * Init
      * @param options
      *        getSelectedRows : get current select rows
      *        getSelectedIds  : get current selected row ids
      *        handleRefresh    : calls to refresh table (can pass a toast message)
      *        elementToAttachLoader : getElement()
      */
     init: function (options) {

          this.options = options ? options : {};
          this.getSelectedRows = this.options.getSelectedRows;
          this.getSelectedIds = this.options.getSelectedIds;
          this.handleRefresh = this.options.handleRefresh;
          this.clearSelection = this.options.clearSelection;
          this.eventBus = this.options.eventBus;
     },

     activateSelection: function () {
          var selectedRows = this.getSelectedRows();
          var warningMessage, warningHeader;

          if (selectedRows.length > 1) {
                warningHeader = Dictionary.get("dialogMessages.HEADER_ACTIVATE_DECISION_RULES");
                warningMessage = Dictionary.get("dialogMessages.ACTIVATE_DECISION_RULES_MESSAGE");
                warningMessage = warningMessage.replace("{0}", selectedRows.length);
          } else {
                warningHeader = Dictionary.get("dialogMessages.HEADER_ACTIVATE_DECISION_RULE_SINGULAR");
                warningMessage = Dictionary.get("dialogMessages.ACTIVATE_DECISION_RULE_SINGULAR_MESSAGE");
          }
          DialogUtils.showWarningDialogWithActionAndCancel(warningHeader, warningMessage, "", Dictionary.captions.OK, this.sendActivateCall.bind(this), "450px", undefined, true);
     },

     sendActivateCall: function () {
          var newState = Constants.serverConstants.ACTIVE;
          var loadingMessage = Dictionary.get("loadingMessages.LOADING_ACTIVATING_DECISION_RULE");
          var onStatusUpdateError = this.onActivateError.bind(this);
          this.updateStatus(newState, loadingMessage, onStatusUpdateError);
     },

     deactivateSelection: function () {
          var selectedRows = this.getSelectedRows();
          var warningMessage, warningHeader;

          if (selectedRows.length > 1) {
                warningHeader = Dictionary.get("dialogMessages.HEADER_DEACTIVATE_DECISION_RULES");
                warningMessage = Dictionary.get("dialogMessages.DEACTIVATE_DECISION_RULES_MESSAGE");
                warningMessage = warningMessage.replace("{0}", selectedRows.length);
          } else {
                warningHeader = Dictionary.get("dialogMessages.HEADER_DEACTIVATE_DECISION_RULE_SINGULAR");
                warningMessage = Dictionary.get("dialogMessages.DEACTIVATE_DECISION_RULE_SINGULAR_MESSAGE");
          }
          DialogUtils.showWarningDialogWithActionAndCancel(warningHeader, warningMessage, "", Dictionary.captions.OK, this.sendDeactivateCall.bind(this), "450px", undefined, true);
     },

     sendDeactivateCall: function () {
          var newState = Constants.serverConstants.INACTIVE;
          var loadingMessage = Dictionary.get("loadingMessages.LOADING_DEACTIVATING_DECISION_RULE");
          var onStatusUpdateError = this.onDeactivateError.bind(this);
          this.updateStatus(newState, loadingMessage, onStatusUpdateError);
     },

     updateStatus: function (newState, loadingMessage, onStatusUpdateError) {
          this.showLoadingAnimation(true, loadingMessage);

          var selectedIds = this.getSelectedIds();
          var data = [];
          for (var i in selectedIds) {
          data.push({id: selectedIds[i], status: newState});
          }

          ajaxService.patchCall({
                url: UrlConstants.decision.DECISION_GRID_DATA + "/" + "?userId=",
                data: JSON.stringify(data),
                contentType: HttpConstants.mediaTypes.CONTENT_TYPE_APPLICATION_JSON,
                dataType: HttpConstants.mediaTypes.JSON,
                success: this.onStatusUpdateSuccess.bind(this),
                error: onStatusUpdateError
          });
     },

     onStatusUpdateSuccess: function (response) {
          this.showLoadingAnimation(false);
          this.handleRefresh(Dictionary.get("toasts.STATUS_UPDATE_TOAST"));
     },

     onActivateError: function (code, response) {
          this.showLoadingAnimation(false);
          if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog(Dictionary.get("forbiddenActionMessages.ACTIVATE_DECISION_RULE"));
          }
          else if (DialogUtils.alreadyExistsError(response)){
                var errHead = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_ACTIVATE_DECISION_RULE");
                var errorMessage = Dictionary.get("dialogMessages.FAILED_DECISION_RULE_MESSAGE");
                DialogUtils.showMultiLineErrorAlert(errorMessage, "", errHead);
          } else {
                var errorHeader = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_ACTIVATE_DECISION_RULE");
                DialogUtils.showError(errorHeader, response);
          }
     },

     onDeactivateError: function (model, response) {
          this.showLoadingAnimation(false);
          if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog(Dictionary.get("forbiddenActionMessages.DEACTIVATE_DECISION_RULE"));
          } else {
                var errorHeader = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_DEACTIVATE_DECISION_RULE");
                DialogUtils.showError(errorHeader, response);
          }
     },

     /**
      * Method to edit decision rule - available on single row selection.
      */
     editSelection: function () {
          var selectedRowData = this.getSelectedRowData();

          new EditDecisionRuleDialog({
                patchURL: UrlConstants.decision.DECISION_GRID_DATA + "/" + selectedRowData.id,
                dialogHeader: Dictionary.captions.EDIT_DECISION_RULE,
                eventBus: this.options.eventBus,
                data: selectedRowData,
                handleRefresh: this.handleRefresh.bind(this)
          }).showEditDecisionRuleDialog();
     },

     getSelectedRowData: function() {
          var selectedRows = this.getSelectedRows();
          var updateAlternativeAction = "No Alternative Action";

          if (selectedRows.length === 0) {
                return;
          }
          var selectedRow = selectedRows[0];

          var dataToEdit = {
                id: selectedRow.id,
                severity: selectedRow.severity,
                severityEvaluation: selectedRow.severityEvaluation,
                action: selectedRow.action,
                assetType: selectedRow.assetType,
                eventType: selectedRow.eventType,
                meterName: selectedRow.meterName,
                tenantName: selectedRow.tenantName,
                status: selectedRow.status
          };
          if (selectedRow.alternativeAction !== null){
              dataToEdit.actionCount = selectedRow.actionCount;
              dataToEdit.alternativeAction = selectedRow.alternativeAction;
              dataToEdit.timeLapse = selectedRow.timeLapse;
          }
          else if (selectedRow.alternativeAction === null) {
                dataToEdit.actionCount = selectedRow.actionCount;
                dataToEdit.alternativeAction = updateAlternativeAction;
                dataToEdit.timeLapse = selectedRow.timeLapse;
          }
          return dataToEdit;

     },

     /**
      * Method available on single and multiple row selection
      */
     deleteSelection: function () {
          var selectedRows = this.getSelectedRows();
          var warningMessage, warningHeader;

          if (selectedRows.length > 1) {
                warningHeader = Dictionary.get("dialogMessages.HEADER_DELETE_DECISION_RULES");
                warningMessage = Dictionary.get("dialogMessages.DELETE_DECISION_RULES_MESSAGE");
                warningMessage = warningMessage.replace("{0}", selectedRows.length);
          } else {
                warningHeader = Dictionary.get("dialogMessages.HEADER_DELETE_DECISION_RULE_SINGULAR");
                warningMessage = Dictionary.get("dialogMessages.DELETE_DECISION_RULE_SINGULAR_MESSAGE");
          }

          DialogUtils.showWarningDialogWithActionAndCancel(warningHeader, warningMessage, "", Dictionary.captions.OK,
                  this.sendServerCallToDelete.bind(this, selectedRows.length), "450px", undefined, true);
     },

     sendServerCallToDelete: function (deleteCount) {
          var isSingleRowDelete = (deleteCount === 1);

          var loadingMessage;
          if (isSingleRowDelete) {
                loadingMessage = Dictionary.loadingMessages.LOADING_DELETING_SINGULAR_DECISION_RULE;
          } else {
                loadingMessage = Dictionary.loadingMessages.LOADING_DELETING_DECISION_RULES.replace("{0}", deleteCount);
          }

          this.showLoadingAnimation(true, loadingMessage);

          ajaxService.deleteCall({
          url: UrlConstants.decision.DECISION_GRID_DATA + "/" + "?userId=",
          data: JSON.stringify(this.getSelectedIds()),
          contentType: HttpConstants.mediaTypes.CONTENT_TYPE_APPLICATION_JSON,
          dataType: HttpConstants.mediaTypes.JSON,
          success: this.onDeleteSuccess.bind(this, isSingleRowDelete),
          error: this.onDeleteError.bind(this, isSingleRowDelete)
          });
     },

     onDeleteSuccess: function (isSingleRowDelete, response) {
          this.clearSelection();
          this.showLoadingAnimation(false);
          if (response.httpStatusCode === 206) {
              var errorHeader = Dictionary.get("dialogMessages.HEADER_PARTIAL_FAILURE_TO_DELETE_DECISION_RULE");
              DialogUtils.showError(errorHeader, response);
          } else {
              var toastMsg = (isSingleRowDelete) ? Dictionary.toasts.DECISION_RULE_DELETE_SINGULAR_SUCCESS_TOAST : Dictionary.toasts.DECISION_RULES_DELETE_SUCCESS_TOAST;
              this.handleRefresh(toastMsg);
          }
     },

     onDeleteError: function (isSingleRowDelete, code, response) {

          this.showLoadingAnimation(false);
          if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog((isSingleRowDelete) ? Dictionary.forbiddenActionMessages.DELETE_DECISION_RULE :
                    Dictionary.forbiddenActionMessages.DELETE_DECISION_RULES);
          } else {

          var errorHeader = (isSingleRowDelete) ? Dictionary.dialogMessages.HEADER_UNABLE_TO_DELETE_DECISION_RULE :
              Dictionary.dialogMessages.HEADER_UNABLE_TO_DELETE_DECISION_RULES;

          DialogUtils.showError(errorHeader, response);
          }
     },

     /**
      * This loading animation shall block out the whole page
      * whilst delete is on-going (no access to top section buttons)
      *
      * @param isShow - if true the loader is displayed, otherwise it is destroyed
      */
     showLoadingAnimation: function (isShow, loadingMessage) {
          this.eventBus.publish(Constants.events.LOADING_EVENT, isShow, loadingMessage);
     }
     });
});
