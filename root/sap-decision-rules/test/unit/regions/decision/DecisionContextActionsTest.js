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
 * Date: 09/03/18
 */
define([
    'jscore/core',
    'jscore/ext/net',
    'widgets/Dialog',
    'eso-commonlib/DialogUtils',
    'sap-decision-rules/regions/decision/DecisionRegion',
    'sap-decision-rules/regions/decision/DecisionContextActions'
], function (core, net, Dialog, DialogUtils, DecisionRegion, DecisionContextActions) {
    'use strict';

    var sandbox, contextActionsToTest, region, mockEventBus, mockContext, ajaxStub;

    describe('DecisionContextActions Test', function () {

        beforeEach(function () {

            sandbox = sinon.sandbox.create();

            mockContext = new core.AppContext();
            mockEventBus = new core.EventBus();
            mockContext.eventBus = mockEventBus;

            ajaxStub = sandbox.stub(net, 'ajax');

            sandbox.stub(DialogUtils, 'showWarningDialogWithActionAndCancel');
            sandbox.stub(DialogUtils, 'showMultiLineErrorAlert');

            region = new DecisionRegion({
                context: mockContext

            });

            contextActionsToTest = new DecisionContextActions({
                getSelectedRows: region.getSelectedRows.bind(region),
                getSelectedIds: region.getSelectedIds.bind(region),
                handleRefresh: region.handleRefresh.bind(region),
                clearSelection: function() {},
                eventBus: mockEventBus
            });
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should be defined", function () {
            expect(DecisionContextActions).to.be.defined;
        });

        describe("DecisionContextActions Tests", function () {

            describe('#activateSelection() test', function () {

                it("should show warning for single activation", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.activateSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Activate Decision Rule");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to activate the Decision Rule?");
                });

                it("should show a different warning for multiple activations", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id0"},
                            {id: "id1"},
                            {id: "id2"},
                            {id: "id3"}
                        ];
                    });

                    contextActionsToTest.activateSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Activate Decision Rules");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to activate 4 Decision Rules?");
                });
            });

            describe('#sendActivateCall() single activate test', function () {

                it("should send correct ajax call", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.sendActivateCall();
                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/decision/?userId=",
                        type: "PATCH",
                        data: JSON.stringify([{"id":"id1","status":"Active"}])
                    })).to.equal(true);
                });
            });

            describe('#sendActivateCall() multipe activates test', function () {

                it("should send correct ajax call", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });

                    contextActionsToTest.sendActivateCall();
                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/decision/?userId=",
                        type: "PATCH",
                        data: JSON.stringify([{"id":"id1","status":"Active"}, {"id":"id2","status":"Active"}])
                    })).to.equal(true);
                });
            });

            describe('#onStatusUpdateSuccess() test', function () {
                it("calls to refresh grid with a toast message for single row delete", function () {
                    sandbox.stub(contextActionsToTest, 'handleRefresh');
                    contextActionsToTest.onStatusUpdateSuccess({});
                    expect(contextActionsToTest.handleRefresh.getCall(0).args[0]).to.equal("Status updated");
                });
            });

            describe('#onActivateError() test', function () {
                it("shows forbidden dialog for 401 error", function () {
                    sandbox.stub(DialogUtils, "showForbiddenDialog");
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });
                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        401,
                        {
                            getStatus: function () {
                                return 401;
                            }
                        }
                    );

                    contextActionsToTest.sendActivateCall();
                    expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal("activate Decision Rule");

                });

                it("shows standard error dialog for regular error", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });
                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        500,
                        {
                            getStatus: function () {
                                return 500;
                            }
                        }
                    );

                    contextActionsToTest.sendActivateCall();

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Activate Decision Rule");
                });
            });

            describe('#deactivateSelection() test', function () {

                it("should show warning for single deactivation", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.deactivateSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Deactivate Decision Rule");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to deactivate the Decision Rule?");
                });

                it("should show a different warning for multiple deactivations", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id0"},
                            {id: "id1"},
                            {id: "id2"},
                            {id: "id3"}
                        ];
                    });

                    contextActionsToTest.deactivateSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Deactivate Decision Rules");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to deactivate 4 Decision Rules?");
                });
            });

            describe('#sendDeactivateCall() single deactivate test', function () {

                it("should send correct ajax call", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.sendDeactivateCall();
                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/decision/?userId=",
                        type: "PATCH",
                        data: JSON.stringify([{"id":"id1","status":"Inactive"}])
                    })).to.equal(true);
                });
            });

            describe('#sendDeactivateCall() multipe activates test', function () {

                it("should send correct ajax call", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });

                    contextActionsToTest.sendDeactivateCall();
                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/decision/?userId=",
                        type: "PATCH",
                        data: JSON.stringify([{"id":"id1","status":"Inactive"}, {"id":"id2","status":"Inactive"}])
                    })).to.equal(true);
                });
            });

            describe('#onDeactivateError() test', function () {
                it("shows forbidden dialog for 401 error", function () {
                    sandbox.stub(DialogUtils, "showForbiddenDialog");
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });
                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        401,
                        {
                            getStatus: function () {
                                return 401;
                            }
                        }
                    );

                    contextActionsToTest.sendDeactivateCall();
                    expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal("deactivate Decision Rule");

                });

                it("shows standard error dialog for regular error", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });
                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        500,
                        {
                            getStatus: function () {
                                return 500;
                            }
                        }
                    );

                    contextActionsToTest.sendActivateCall();

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Activate Decision Rule");
                });
            });

            describe('#deleteSelection() test', function () {

                it("should show warning for single selection", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.deleteSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Delete Decision Rule");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to delete the Decision Rule?");
                });

                it("should show a different warning for multiple selection", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id0"},
                            {id: "id1"},
                            {id: "id2"},
                            {id: "id3"}
                        ];
                    });

                    contextActionsToTest.deleteSelection();

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0]).to.equal("Delete Decision Rules");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1]).to.equal("Are you sure you want to delete 4 Decision Rules?");
                });
            });

            describe('#sendServerCallToDelete() test', function () {
                it("should send correct ajax call", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });

                    contextActionsToTest.sendServerCallToDelete(1);

                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/decision/?userId=",
                        type: "DELETE",
                        data: JSON.stringify(["id1"])   // an array always
                    })).to.equal(true);
                });
            });

            describe('#onDeleteSuccess() test', function () {

                it("calls to refresh grid with a toast message for single row delete", function () {
                    sandbox.stub(contextActionsToTest, 'handleRefresh');
                    contextActionsToTest.onDeleteSuccess(true, {}, {getStatus : function(){return 200;}});
                    expect(contextActionsToTest.handleRefresh.getCall(0).args[0]).to.equal("Delete Decision Rule request sent");
                });

                it("calls to refresh grid with a different toast message for multiple row delete", function () {
                    sandbox.stub(contextActionsToTest, 'handleRefresh');
                    contextActionsToTest.onDeleteSuccess(false, {}, {getStatus : function(){return 200;}});
                    expect(contextActionsToTest.handleRefresh.getCall(0).args[0]).to.equal("Delete Decision Rules request sent");
                });
            });

            describe('#onDeleteError() test', function () {
                it("shows forbidden dialog for 401 error", function () {
                    sandbox.stub(DialogUtils, "showForbiddenDialog");

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"}
                        ];
                    });
                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        401,
                        {
                            getStatus: function () {
                                return 401;
                            }
                        }
                    );
                    contextActionsToTest.sendServerCallToDelete(1);
                    expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal("delete Decision Rule");
                });

                it("shows bespoke error dialog for error key found in dictionary", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });

                    ajaxStub.yieldsTo('error',
                        503,
                        {
                            getStatus: function () {
                                return 503;
                            }
                        }
                    );

                    contextActionsToTest.sendServerCallToDelete(2);

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("Service Unavailable. Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Delete Decision Rules");
                });

                it("shows standard error dialog for regular error", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1", "id2"];
                    });
                    sandbox.stub(contextActionsToTest, 'getSelectedRows', function () {
                        return [
                            {id: "id1"},
                            {id: "id2"}
                        ];
                    });

                    sandbox.stub(Dialog.prototype, 'show');

                    ajaxStub.yieldsTo('error',
                        500,
                        {
                            getStatus: function () {
                                return 500;
                            }
                        }

                    );
                    contextActionsToTest.sendServerCallToDelete(2);

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to Delete Decision Rules");
                });
            });
        });
    });
})
;
