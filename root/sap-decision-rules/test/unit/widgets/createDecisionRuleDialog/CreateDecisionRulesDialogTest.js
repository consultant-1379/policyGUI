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
 * Date: 05/03/18
 */
define([
     'jscore/ext/net',
     "jscore/core",
     "sap-decision-rules/widgets/createDecisionRuleDialog/CreateDecisionRulesDialog",
     'widgets/Dialog',
     'eso-commonlib/DialogUtils',
     'layouts/Form',
], function (net, core, CreateDecisionRulesDialog, Dialog, DialogUtils, Form) {
     'use strict';

     var sandbox, ajaxStub, createDecisionRulesDialogToTest, mockForm;

        describe('CreateDecisionRulesDialog Test', function () {
            it("should be defined", function () {
                expect(CreateDecisionRulesDialog).to.be.defined;

            });

        describe("CreateDecisionRulesDialog Tests", function () {

            beforeEach(function () {

                mockForm = {
                    getFields: function() {
                        return [{name:"eventType",
                        "input": {
                            addEventHandler: function() {}
                            }},
                        {name:"assetType",
                        "input": {
                            addEventHandler: function() {}
                        }},
                        {name:"primaryAction",
                        "input": {
                            getValue: function() {return {value:"restart"};}
                        }},
                        {name:"severity",
                        "input": {
                            addEventHandler: function() {}
                        }},
                        {name:"severityEvaluation",
                        "input": {
                            addEventHandler: function() {}
                        }},
                       {name:"alternativeAction",
                       "input": {
                           getValue: function() {return {value:"None"};}
                        }}
                    ];
                    },
                    getData: function() {
                        return {
                        "eventType":"PM",
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

                createDecisionRulesDialogToTest = new CreateDecisionRulesDialog({
                    postURL: '/policynbi/sd/v1.0/decision/',
                    eventBus: new core.EventBus(),
                    handleRefresh: function () {
                    },
                    dialogHeader: 'Create Decision Rules Test',
                });

                sandbox.stub(createDecisionRulesDialogToTest, "createForm", function() {
                    return mockForm;
                });

            });

            afterEach(function () {
                sandbox.restore();
                createDecisionRulesDialogToTest.onDestroy();
            });

        describe('showDecisionRulesDialog() test', function () {

            it("should create a form", function () {
                expect(createDecisionRulesDialogToTest.form).not.to.be.defined;
                expect(createDecisionRulesDialogToTest.setUpFields).not.to.be.defined;

                createDecisionRulesDialogToTest.showDecisionRulesDialog();

                expect(createDecisionRulesDialogToTest.form).to.be.defined;
                expect(createDecisionRulesDialogToTest.setUpFields).to.be.defined;
            });

            it('showDecisionRulesDialog attaches form to window', function() {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                expect(createDecisionRulesDialogToTest.form).to.be.defined;
                expect(createDecisionRulesDialogToTest.form.attachTo(createDecisionRulesDialogToTest.showDecisionRulesDialog()));
            });
        });

        describe('createFormAndAttach() test', function () {
            it("should create and attach form", function () {
                expect(createDecisionRulesDialogToTest.form).to.be.defined;
                expect(createDecisionRulesDialogToTest.setUpFields).to.be.defined;

                createDecisionRulesDialogToTest.createFormAndAttach();

                expect(createDecisionRulesDialogToTest.form).to.be.defined;

            });

        });

        describe('createForm() test', function () {

            it("should create form", function () {

                expect(createDecisionRulesDialogToTest.form).not.to.be.defined;

                createDecisionRulesDialogToTest.createForm();

                expect(createDecisionRulesDialogToTest.form).to.be.defined;

            });

        });

        describe('cleanUpOnCloseAction() test', function () {

            it("should remove form", function () {

                expect(createDecisionRulesDialogToTest.form).to.be.defined;
                expect(createDecisionRulesDialogToTest.setUpFields).to.be.defined;

                createDecisionRulesDialogToTest.cleanUpOnCloseAction();

                expect(createDecisionRulesDialogToTest.form).not.to.be.defined;
                expect(createDecisionRulesDialogToTest.setUpFields).not.to.be.defined;

            });

        });

        describe('alternativeActionValuesAllSetOrNotSet() test methods', function () {
            var actionCountValue = "2";
            var timeLapse = "4";
            var alternativeAction = "None";
            it("it should return true", function () {
                if (!actionCountValue && !timeLapse && (alternativeAction === "None")){
                    expect(createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet()).to.equal(true);
                }
            });

            it("it should return false", function () {
                if (actionCountValue && timeLapse && (alternativeAction !== "None")){
                    createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                    expect(createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet()).to.equal(false);
                }
            });
        });
        describe('getAlternativeActionValue test', function() {
            it("should return an None value for alternativeAction value", function () {
                var alternativeAction  = {value: "None"};
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                if (alternativeAction){
                    expect(createDecisionRulesDialogToTest.getAlternativeActionValue()).to.equal("None");
                }
            });
        });

        describe('getAlternativeActionValue test', function() {
            it("should return an recreate alternativeAction value", function () {
                var alternativeAction  = {value: "recreate"};
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                if (!alternativeAction.value){
                    expect(createDecisionRulesDialogToTest.getAlternativeActionValue()).to.equal("recreate");
                }
            });
        });

        describe('activate() test', function () {
            it("shows activate is successful", function () {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                if (createDecisionRulesDialogToTest.formValidator.checkValidity.success){
                    expect(createDecisionRulesDialogToTest.createDecisionRule.callCount).to.equal(1);
                }
             });
             it("shows activate is unsuccessful", function () {
                 createDecisionRulesDialogToTest.showDecisionRulesDialog();
                 createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                 if (createDecisionRulesDialogToTest.formValidator.checkValidity.error){
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be activated.");
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("There are errors with the Dialog box.");
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                 }
              });
             it("shows activate is unsuccessful due to validation error", function () {
                 createDecisionRulesDialogToTest.showDecisionRulesDialog();
                 if (!createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet){
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be activated.");
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("All 3 Alternate Action options must be selected or none at all.");
                     expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                 }
             });
        });

        describe('createDecisionRule() test', function () {
              it("sendCreatePostRequest is called to post request", function () {
                  sandbox.stub(createDecisionRulesDialogToTest, 'showLoadingAnimation');
                  createDecisionRulesDialogToTest.showDecisionRulesDialog();

                  createDecisionRulesDialogToTest.createDecisionRule();

                  expect(net.ajax.getCall(0).calledWithMatch({
                      url: "/policynbi/sd/v1.0/decision/PM",
                      type: "POST",
                  })).to.equal(true);
              });
        });

        describe('sendCreatePostRequest() test', function (){
            it("sends post request to create Decision Rule", function (){
                createDecisionRulesDialogToTest.sendCreatePostRequest();
                expect(net.ajax.getCall(0).calledWithMatch({

                type: 'POST',
                url: "/policynbi/sd/v1.0/decision/PM"
                })).to.equal(true);
            });
        });

        describe('save() test', function () {
            it("shows save is successful", function () {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                if (createDecisionRulesDialogToTest.formValidator.checkValidity.success){
                    expect(createDecisionRulesDialogToTest.createDecisionRule.callCount).to.equal(1);
                }
            });
            it("shows save is unsuccessful", function () {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet();
                if (createDecisionRulesDialogToTest.formValidator.checkValidity.error){
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be saved.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("There are errors with the Dialog box.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                }
            });
            it("shows save is unsuccessful due to validation error", function () {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();
                if (!createDecisionRulesDialogToTest.alternativeActionValuesAllSetOrNotSet){
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Decision Rule will not be saved.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("All 3 Alternate Action options must be selected or none at all.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Decision Rule Dialog Error");
                }
            });
        });

        describe('handleCreateSuccess() test', function () {
            it("handleRefresh response is Successful ", function () {
                sandbox.stub(createDecisionRulesDialogToTest, 'handleRefresh');
                createDecisionRulesDialogToTest.handleCreateSuccess();
                expect(createDecisionRulesDialogToTest.handleRefresh.getCall(0).args[0]).to.equal("Create Decision Rule Succeeded");
                });
        });

        describe('onCreateError() test', function () {
            it("shows forbidden dialog for 401 error", function () {
                sandbox.stub(DialogUtils, "showForbiddenDialog");

                createDecisionRulesDialogToTest.showDecisionRulesDialog();

                ajaxStub.yieldsTo('error',
                    401,
                    {
                    getStatus: function () {
                        return 401;
                    }
                    }
                );

                createDecisionRulesDialogToTest.activate();
                expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal("activate Decision Rule");

            });

            it("shows standard error dialog for regular error", function () {
                createDecisionRulesDialogToTest.showDecisionRulesDialog();

                ajaxStub.yieldsTo('error',
                    500,
                    {
                    getStatus: function () {
                        return 500;
                    }
                    }
                );

                createDecisionRulesDialogToTest.activate();

                expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Activate Decision Rule");
                });
        });

        describe('#showLoadingAnimation() test', function () {
            it("should create a loader when true passed", function () {

                expect(createDecisionRulesDialogToTest.loader).not.to.be.defined;

                createDecisionRulesDialogToTest.showLoadingAnimation(true, "hello");

                expect(createDecisionRulesDialogToTest.loader).to.be.defined;
            });

            it("should delete a loader when false passed", function () {

                createDecisionRulesDialogToTest.showLoadingAnimation(true, "hello");

                expect(createDecisionRulesDialogToTest.loader).to.be.defined;

                createDecisionRulesDialogToTest.showLoadingAnimation(false);

                expect(createDecisionRulesDialogToTest.loader).not.to.be.defined;
            });
        });
    });
    });
});
