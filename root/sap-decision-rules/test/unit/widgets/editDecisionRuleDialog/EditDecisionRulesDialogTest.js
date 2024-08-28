/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.....
 *******************************************************************************
 * User: eeicmsy
 * Date: 05/03/18
 */
define([
    'jscore/ext/net',
    "jscore/core",
    "sap-decision-rules/widgets/editDecisionRuleDialog/EditDecisionRuleDialog",
    "sap-decision-rules/widgets/editDecisionRuleDialog/EditDecisionRuleDialogView",
    'widgets/Dialog',
    'eso-commonlib/DialogUtils',
    'layouts/Form',
], function (net, core, EditDecisionRuleDialog, View, Dialog, DialogUtils, Form) {
    'use strict';

    var sandbox, ajaxStub, editDecisionRulesDialogToTest, mockForm, status, mockData;

    describe('EditDecisionRuleDialog Test', function () {

        it("should be defined", function () {
            expect(EditDecisionRuleDialog).to.be.defined;

        });

        describe("EditDecisionRuleDialog Tests", function () {
            beforeEach(function () {

                mockForm = {
                        getFields: function() {
                            return [{name:"eventType",
                                "input": {
                                    addEventHandler: function() {}
                                    }}
                            ];
                        },

                        getData: function() {
                            return {
                                "eventType":"pm",
                                "assetType":"VM",
                                "primaryAction": {"action": "restart"},
                                 "severity": "Minor",
                                 "severityEvaluation": "Greater than",
                                 "meterName": "cpu",
                                 "tenantName": "abc",
                                 "status": "Inactive",
                                 "alternateAction": {"action": "recreate"}
                            };
                        },
                        detach: function() {
                        },
                        attachTo: function() {
                        },
                }
                sandbox = sinon.sandbox.create();

                ajaxStub = sandbox.stub(net, 'ajax');

                sandbox.stub(Dialog.prototype, 'show');
                sandbox.stub(DialogUtils, 'showWarningDialogWithActionAndCancel');
                sandbox.stub(DialogUtils, 'showMultiLineErrorAlert');

                editDecisionRulesDialogToTest = new EditDecisionRuleDialog({
                    patchURL: '/policynbi/sd/v1.0/decision/1',
                    handleRefresh: function () {
                    },
                    eventBus: new core.EventBus(),
                    dialogHeader: 'Edit Decision Rules Test',
                    data: function () {
                        return [
                          {status: "Inactive"},
                          {eventType:"pm"},
        
                      ];
                    }
                });

                sandbox.stub(editDecisionRulesDialogToTest, "createForm", function() {
                    return mockForm;
                });

            });
            afterEach(function () {

                sandbox.restore();
                editDecisionRulesDialogToTest.onDestroy();
            });

            describe('showLoadingAnimation() test', function () {
                it("should create a loader when true passed", function () {

                    expect(editDecisionRulesDialogToTest.loader).not.to.be.defined;

                    editDecisionRulesDialogToTest.showLoadingAnimation(true, "hello");

                    expect(editDecisionRulesDialogToTest.loader).to.be.defined;
                });

                it("should delete a loader when false passed", function () {

                    editDecisionRulesDialogToTest.showLoadingAnimation(true, "hello");

                    expect(editDecisionRulesDialogToTest.loader).to.be.defined;

                    editDecisionRulesDialogToTest.showLoadingAnimation(false);

                    expect(editDecisionRulesDialogToTest.loader).not.to.be.defined;
                });
            });

            describe('showEditDecisionRuleDialog() test', function () {
                it("should create a form to edit", function () {
     
                    expect(editDecisionRulesDialogToTest.form).not.to.be.defined;
                    expect(editDecisionRulesDialogToTest.setUpFields).not.to.be.defined;

                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();

                    expect(editDecisionRulesDialogToTest.form).to.be.defined;
                    expect(editDecisionRulesDialogToTest.setUpFields).to.be.defined;
                });
                it('showEditDecisionRuleDialog attaches form to window', function() {

                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    expect(editDecisionRulesDialogToTest.form).to.be.defined;
                    expect(editDecisionRulesDialogToTest.form.attachTo(editDecisionRulesDialogToTest.showEditDecisionRuleDialog()));
                });
            });
            describe('cleanUpOnCloseAction() test', function () {

                it("should remove form", function () {

                    expect(editDecisionRulesDialogToTest.form).to.be.defined;
                    expect(editDecisionRulesDialogToTest.setUpFields).to.be.defined;

                    editDecisionRulesDialogToTest.cleanUpOnCloseAction();

                    expect(editDecisionRulesDialogToTest.form).not.to.be.defined;
                    expect(editDecisionRulesDialogToTest.setUpFields).not.to.be.defined;

                });
            });

            describe('setUpFields() test', function (){
                it('should add fields to a form and call addFormValidators', function (){
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    expect(editDecisionRulesDialogToTest.form).to.be.defined;
                    expect(editDecisionRulesDialogToTest.addFormValidators.called);
                });
            });

            describe('selectForm() test', function (){
                it('should select the correct form based on eventType', function (){
                    var eventT = {value:"pm"};

                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.selectForm();

                    if (eventT){
                        expect(editDecisionRulesDialogToTest.createForm.called);
                    }

                });
            });

             describe('alternativeActionValuesAllSetOrNotSet() test methods', function () {
                 var actionCountValue = "2";
                 var timeLapse = "4";
                 var alternativeAction = "None";
                 it("it should return true", function () {
                      if (!actionCountValue && !timeLapse && (alternativeAction === "None")){
                          editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                         expect(alternativeActionValuesAllSetOrNotSet).to.equal(true);
                      }
                 });

                 it("it should return false", function () {
                      if (actionCountValue && timeLapse && (alternativeAction !== "None")){
                          editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                         expect(alternativeActionValuesAllSetOrNotSet).to.equal(false);
                      }
                });
            });
            describe('getAlternativeActionValue test', function() {
                it("should return an None value for alternativeAction value", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();

                    expect(editDecisionRulesDialogToTest.getAlternativeActionValue()).to.equal("None");
                });
            });
            describe('getAlternativeActionValue test', function() {
                it("should return an recreate alternativeAction value", function () {
                    var alternativeAction  = {value: "recreate"};
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.getAlternativeActionValue();
                    if (!alternativeAction.value){
                        expect(editDecisionRulesDialogToTest.alternativeAction.value).to.equal("recreate");
                    }
                });
            });
            describe('sendEditDecisionRuleCall() test', function () {
                it("updateDecisionRule is called to patch request", function () {
                    sandbox.stub(editDecisionRulesDialogToTest, 'showLoadingAnimation');
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();

                    editDecisionRulesDialogToTest.sendEditDecisionRuleCall();

                     expect(net.ajax.getCall(0).calledWithMatch({
                         url: "/policynbi/sd/v1.0/decision/1",
                         type: "PATCH",
                     })).to.equal(true);
                });
            });
            describe('handleCreateSuccess() test', function () {

                it("handleRefresh response is Successful ", function () {

                    sandbox.stub(editDecisionRulesDialogToTest, 'handleRefresh');
                    editDecisionRulesDialogToTest.handleCreateSuccess();
                    expect(editDecisionRulesDialogToTest.handleRefresh.getCall(0).args[0]).to.equal("Update Decision Rule Succeeded");
                });
            });
            describe('onCreateError() test', function () {
                it("shows forbidden dialog for 401 error", function () {
                    sandbox.stub(DialogUtils, "showForbiddenDialog");

                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();

                    ajaxStub.yieldsTo('error',
                            401,
                            {
                            getStatus: function () {
                                return 401;
                        }
                   });

                    editDecisionRulesDialogToTest.activate();
                    expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal("activate Decision Rule");

                });

                it("shows standard error dialog for regular error", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();

                    ajaxStub.yieldsTo('error',
                            500,
                            {
                            getStatus: function () {
                                return 500;
                                }
                            });

                    editDecisionRulesDialogToTest.activate();

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Activate Decision Rule");
                });
            });
            describe('save() test', function () {
                it("shows save is successful", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                    if (editDecisionRulesDialogToTest.formValidator.checkValidity.success){
                        expect(editDecisionRulesDialogToTest.sendEditDecisionRuleCall.callCount).to.equal(1);
                    }
                });
                it("shows save is unsuccessful", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                    if (editDecisionRulesDialogToTest.formValidator.checkValidity.error){
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be saved.");
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("There are errors with the Dialog box.");
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                    }
               });
               it("shows save is unsuccessful due to validation error", function () {
                   editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                   if (!editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet){
                       expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be saved.");
                       expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("All 3 Alternate Action options must be selected or none at all.");
                       expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                   }
              });
            });
            describe('activate() test', function () {
                it("shows activate is successful", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                    if (editDecisionRulesDialogToTest.formValidator.checkValidity.success){
                        expect(editDecisionRulesDialogToTest.sendEditDecisionRuleCall.callCount).to.equal(1);
                    }
                });
                it("shows activate is unsuccessful", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                    if (editDecisionRulesDialogToTest.formValidator.checkValidity.error){
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be activated.");                         
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("There are errors with the Dialog box.");
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                    }
                });
                it("shows activate is unsuccessful due to validation error", function () {
                    editDecisionRulesDialogToTest.showEditDecisionRuleDialog();
                    if (!editDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet){
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be activated.");
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("All 3 Alternate Action options must be selected or none at all.");
                        expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                    }
                });
            });
        });
    });
});
