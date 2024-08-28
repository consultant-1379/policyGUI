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
 * Date: 01/03/18
 */
define([
    'jscore/core',
    "eso-commonlib/DialogUtils",
    'widgets/Notification',
    'widgets/Dialog',
    'container/api'
], function (core, DialogUtils, Notification, Dialog, container) {
    'use strict';

    var sandbox, arg1, arg2;

    describe('DialogUtils Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            sandbox.stub(Dialog.prototype, "show");
            sandbox.stub(Dialog.prototype, "hide");
            sandbox.stub(container, 'getEventBus', function () {
                return {
                    publish: function (x, y) {
                        arg1 = x;
                        arg2 = y;
                    }
                }
            });


        });

        afterEach(function () {

            sandbox.restore();

        });

        it("Should be defined", function () {
            expect(DialogUtils).to.be.defined;
        });

        describe('createSuccessToastNotification() test', function () {

            it("Should create a Notification", function () {

                var expectedOptions = {
                    label: "testWord",
                    icon: 'tick',
                    color: 'green',
                    showCloseButton: true,
                    autoDismiss: true,
                    showAsToast: true,
                    autoDismissDuration: 5000
                };

                var notification = DialogUtils.createSuccessToastNotification("testWord");
                expect(notification instanceof Notification).to.equal(true);
                expect(expectedOptions).to.deep.equal(notification.options);
            });

        });

        describe('showFullScreenErrorMessage() test', function () {

            it("Should show a full screen message with correct arguments", function () {
                var expectedArg2 = {
                    header: "header",
                    content: "content"
                };

                DialogUtils.showFullScreenErrorMessage("header", "content");

                expect(arg1).to.equal("container:error");
                expect(expectedArg2).to.deep.equal(arg2);

            });

        });

        describe('showFlyOut() test', function () {


            it("Should call to show a flyout", function () {

                DialogUtils.showFlyOut("header", "content");

                expect(arg1).to.equal("flyout:show");
                expect(arg2).to.deep.equal({header: "header", content: "content"});

            });
        });


        describe('hideFlyout() test', function () {

            it("Should call to hide a flyout", function () {

                DialogUtils.hideFlyOut();

                expect(arg1).to.equal("flyout:hide");
                expect(arg2).to.equal(undefined);

            });
        });


        describe('createErrorInlineMessage() test', function () {

            it("Should be able to translate a server key from the dictionary", function () {

                var errorResponse = {
                    getStatus: function () {
                        return 500;
                    },
                    getResponseJSON: function () {
                        return {
                            internalErrorCode: "ESO_TEST_EXCEPTION_FROM_SERVER"
                        };
                    }
                };

                var inlineMessage = DialogUtils.createErrorInlineMessage(errorResponse);

                expect(inlineMessage.options.header).to.equal('Unable to Retrieve Data');
                expect(inlineMessage.options.description).to.equal('Test Special Server Message');
                expect(inlineMessage.options.icon).to.deep.equal({name:"error"});


            });

            it("Should show a generic message when no internalErrorCode", function () {

                var errorResponse = {
                    getStatus: function () {
                        return 500;
                    },
                    getResponseJSON: function () {
                        return {

                        };
                    }
                };

                var inlineMessage = DialogUtils.createErrorInlineMessage(errorResponse);

                expect(inlineMessage.options.header).to.equal('Unable to Retrieve Data');
                expect(inlineMessage.options.description).to.equal('The server encountered an internal error. Please try again later or contact your System Administrator.');
                expect(inlineMessage.options.icon).to.deep.equal({name:"error"});
            });

        });

        describe('alert() test', function () {

            var variableSet, actionItem;

            beforeEach(function () {
                actionItem = function () {
                    variableSet = "called";
                };
            });

            afterEach(function () {
                DialogUtils.hideAlertWarningDialog();
            });

            it("Should show a Dialog", function () {

                DialogUtils.alert("testWord");

                expect(Dialog.prototype.show.callCount).to.equal(1);

            });

            it("Should define warning dialog", function () {


                DialogUtils.alert("testWord", undefined, undefined, actionItem);

                expect(DialogUtils.warningDialog).to.be.defined;


            });

            it("Should perform action for button 0", function () {

                DialogUtils.alert("testWord", undefined, undefined, actionItem);

                expect(DialogUtils.warningDialog).to.be.defined;


                expect(variableSet).to.equal.undefined;


                DialogUtils.warningDialog.options.buttons[0].action();

                expect(variableSet).to.equal("called");

            });
        });

        describe('showWarningDialogWithActionAndCancel() test', function () {

            var actionCalled,
                cancelCalled,
                warningDialog,
                actionMethod = function () {
                    actionCalled = "called";
                },
                cancelMethod = function () {
                    cancelCalled = "cancelCalled";
                };

            beforeEach(function () {

                warningDialog = DialogUtils.showWarningDialogWithActionAndCancel("Delete Subsystem",
                    "Are you sure you want to delete whatever?", "second line", "ok", actionMethod, "500px", cancelMethod, false, "hideKey");
            });

            it("Should show a Dialog", function () {

                expect(Dialog.prototype.show.callCount).to.equal(1);

            });

            it("Button actions 1 should call action method and close the dialog ", function () {

                warningDialog.options.buttons[0].action();

                expect(actionCalled).to.equal("called");
                expect(Dialog.prototype.hide.callCount).to.equal(1);

            });
        });

        describe('isSecurityDeniedResponse() test', function () {

            it("Should return false when not a 401", function () {

                var result = DialogUtils.isSecurityDeniedResponse({
                    getStatus: function () {
                        return 500;
                    }
                });

                expect(result).to.equal(false);

            });

            it("Should return true when a 401", function () {

                var result = DialogUtils.isSecurityDeniedResponse({
                    getStatus: function () {
                        return 401;
                    }
                });

                expect(result).to.equal(true);

            });
        });

        describe('showMultiLineErrorAlert() test', function () {
            beforeEach(function () {
                DialogUtils.showMultiLineErrorAlert("hello world", "problem happened");  // undefined header
            });

            afterEach(function () {

                DialogUtils.errorDialogHide();
                sandbox.restore();
            });

            it("Header is as expected", function () {
                expect(DialogUtils.errorDialog.options.header).to.be.equal(' ');
            });

            it("content  is as expected", function () {
                expect(DialogUtils.errorDialog.options.content).to.be.equal("hello world");
            });

            it("optional content  is as expected", function () {
                expect(DialogUtils.errorDialog.options.optionalContent).to.be.equal("problem happened");
            });

            it("dialog type is as expected", function () {
                expect(DialogUtils.errorDialog.options.type).to.be.equal("error");
            });

            it("action closes error dialog", function () {
                DialogUtils.errorDialog.options.buttons[0].action();

                expect(DialogUtils.errorDialog).to.be.undefined;  // called #errorDialogHide

            });

        });

        describe('showInfoAlertWithContinue() test', function () {

            var retryCalled,
                noRetryActionCalled,
                retryAction = function () {
                    retryCalled = "called";
                },
                noRetryAction = function () {
                    noRetryActionCalled = "calledNoRetryAction";
                };

            beforeEach(function () {

                DialogUtils.showInfoAlertWithContinue(undefined, 'messageFirstLine', 'messageSecondLine', retryAction, noRetryAction,
                    'cancelButtonCaption', '300px');
            });

            afterEach(function () {
                DialogUtils.retryDialogHide();
                sandbox.restore();
            });

            it("Header is as expected", function () {
                expect(DialogUtils.retryDialog.options.header).to.be.equal(' '); // replaced undefined
            });

            it("content  is as expected", function () {
                expect(DialogUtils.retryDialog.options.content).to.be.equal('messageFirstLine');
            });

            it("optional content  is as expected", function () {
                expect(DialogUtils.retryDialog.options.optionalContent).to.be.equal('messageSecondLine');
            });

            it("dialog type is as expected", function () {
                expect(DialogUtils.retryDialog.options.type).to.be.equal("information");
            });

            it("action button 1 as expected and closes dialog", function () {
                DialogUtils.retryDialog.options.buttons[0].action();

                expect(retryCalled).to.be.equal("called");

                expect(Dialog.prototype.hide.callCount).to.equal(1);
            });

            it("action button 2 as expected and closes dialog", function () {
                DialogUtils.retryDialog.options.buttons[1].action();

                expect(noRetryActionCalled).to.be.equal("calledNoRetryAction");
                expect(Dialog.prototype.hide.callCount).to.equal(1);
            });

        });

        describe('getKeyFromServerErrorResponse() test', function () {

            it("Can retrieve Key from response", function () {

                var errorResponse = {
                    getStatus: function () {
                        return 500;
                    },
                    getResponseJSON: function () {
                        return {
                            internalErrorCode: "ESO_TEST_EXCEPTION_FROM_SERVER",
                            "errorData": [
                                "Failed to parse service template\" 4: unknown parent type \"tosca.nodes.Roots\" in \"nodeB\"|@\"/tmp/tmpjYZ_ce/simple.yaml\":17:19\""
                            ]
                        };
                    }
                };


                var result = DialogUtils.getKeyFromServerErrorResponse(errorResponse);
                expect("ESO_TEST_EXCEPTION_FROM_SERVER").to.be.equal(result);
            });

        });


        describe('showError() test', function () {
            var response;
            beforeEach(function () {
                sandbox.stub(DialogUtils, 'showMultiLineErrorAlert');


            });

            afterEach(function () {
                sandbox.restore();
            });


            it("handles server Error key (server has message in locale file)", function () {

                response = {
                    getStatus : function(){
                        return 500;
                    },
                    getResponseJSON: function () {
                        return {
                            internalErrorCode: "ESO_TEST_EXCEPTION_FROM_SERVER"
                        };
                    }
                };

                DialogUtils.showError('Can not do something header', response);

                expect("Test Special Server Message").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]);
                expect("").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]);
                expect("Can not do something header").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]);  // header

            });

            it("handles standard error (server key attribute not present in response)", function () {

                var response = {
                    getStatus: function () {
                        return 500;
                    },
                    getResponseJSON: function () {
                        return {};  // ignored and replaced with standard message (UX do nor want random errors shown to user
                    }

                };

                DialogUtils.showError("Can not do something header", response);

                expect('The server encountered an internal error.').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]);
                expect('Please try again later or contact your System Administrator.').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]);
                expect("Can not do something header").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]);  // header

            });

            it("handles standard error (server key attribute present but not found in dictionary)", function () {

                var response = {
                    getStatus: function () {
                        return 500;
                    },
                    getResponseJSON: function () {
                        return { "userMessage": "Friendly error message to the user",
                            "httpStatusCode": 500,
                            "internalErrorCode": 'NOT_SOMETHING_IN_DICTIONARY',
                            "developerMessage": "Specific message to help developers solve the issue",
                            "errorData": "[userName1, userName2]"
                        };
                    }

                };

                DialogUtils.showError("Can not do something header2", response);

                expect('The server encountered an internal error.').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]);
                expect('Please try again later or contact your System Administrator.').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]);
                expect("Can not do something header2").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]);  // header

            });


            it("handles status code error present in dictionary (server passes status code rather than server key attribute)", function () {

                var response = {
                    getStatus: function () {
                        return 503;
                    },
                    getResponseJSON: function () {
                        return {
                        };
                    }

                };

                DialogUtils.showError("Can not do something header2", response);

                expect('Service Unavailable. Please try again later or contact your System Administrator.').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]);
                expect('').to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]);
                expect("Can not do something header2").to.equal(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]);  // header

            });


        });


        describe('showForbiddenDialog() test', function () {

            it("Calls to show a Dialog widget", function () {
                DialogUtils.showForbiddenDialog('update configuration records');
                expect(Dialog.prototype.show.callCount).to.equal(1);

            });

        });

        describe('createForbiddenInlineMessage() test', function () {

            it("Shows an RBAC message for the action passed", function () {
                var inlineMessage = DialogUtils.createForbiddenInlineMessage("create a slice");

                expect(inlineMessage.options.header).to.equal('Unauthorized to create a slice');
                expect(inlineMessage.options.description).to.equal('Your role does not allow you to create a slice.');
                expect(inlineMessage.options.icon).to.deep.equal({name:'error'});

            });

        });


        describe('createUnsavedChangesDialogLeavingPageWithMessage() test', function () {
            beforeEach(function () {

                DialogUtils.createUnsavedChangesDialogLeavingPageWithMessage(function () {
                }, function () {
                }, 'contentMessage', 'messageSecondLine');

            });

            afterEach(function () {
                DialogUtils.unsavedChangesDialogHide();
                sandbox.restore();
            });


            it("Header is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.header).to.be.equal("Confirm Navigation");
            });

            it("content  is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.content).to.be.equal("contentMessage");
            });

            it("optional content  is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.optionalContent).to.be.equal("messageSecondLine");
            });

            it("type is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.type).to.be.equal("warning");
            });

        });

        describe('createUnsavedChangesDialogOnRefresh() test', function () {
            beforeEach(function () {

                DialogUtils.createUnsavedChangesDialogOnRefresh(function () {
                }, function () {
                });

            });
            afterEach(function () {
                DialogUtils.unsavedChangesDialogHide();
                sandbox.restore();
            });


            it("Header is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.header).to.be.equal("Confirm Refresh");
            });

            it("content  is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.content).to.be.equal("You have unsaved changes that will be lost if you refresh.");
            });

            it("type is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.type).to.be.equal("warning");
            });

        });

        describe('createUnsavedChangesDialog() test', function () {

            var leaveCalled,
                stayCalled,
                leavePageAction = function () {
                    leaveCalled = true;
                },
                stayOnPageAction = function () {
                    stayCalled = true;
                };

            beforeEach(function () {

                DialogUtils.createUnsavedChangesDialog(leavePageAction, stayOnPageAction);
            });

            afterEach(function () {
                DialogUtils.unsavedChangesDialogHide();
                sandbox.restore();
            });

            it("Header is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.header).to.be.equal("Confirm Navigation");
            });

            it("content  is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.content).to.be.equal("You have unsaved changes that will be lost if you leave this page.");
            });

            it("type is as expected", function () {
                expect(DialogUtils.twoChoicesDialog.options.type).to.be.equal("warning");
            });

            it("action button 1 is as expected", function () {
                DialogUtils.twoChoicesDialog.options.buttons[0].action();
                expect(leaveCalled).to.be.equal(true);
                expect(Dialog.prototype.hide.callCount).to.equal(1);

            });

            it("action button 2 is as expected", function () {
                DialogUtils.twoChoicesDialog.options.buttons[1].action();
                expect(stayCalled).to.be.equal(true);
                expect(Dialog.prototype.hide.callCount).to.equal(1);

            });

        });

    });
});


