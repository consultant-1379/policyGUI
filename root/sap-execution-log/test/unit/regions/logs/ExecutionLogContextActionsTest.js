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
 * Date: 09/03/18
 */
define([
    'jscore/core',
    'container/api',
    'jscore/ext/net',
    'widgets/Dialog',
    'eso-commonlib/DialogUtils',
    "eso-commonlib/JsonDisplayer",
    'sap-execution-log/regions/logs/ExecutionLogRegion',
    'sap-execution-log/regions/logs/ExecutionLogContextActions'
], function (core, container, net, Dialog, DialogUtils, JsonDisplayer, ExecutionLogRegion, ExecutionLogContextActions) {
    'use strict';

    var sandbox, contextActionsToTest, region, mockEventBus, mockContext, ajaxStub;

    describe('ExecutionLogContextActions Test', function () {

        beforeEach(function () {

            sandbox = sinon.sandbox.create();

            sandbox.stub(JsonDisplayer.prototype, 'getRawJSONHolderInnerHTML', function(){
                return {
                    append : function(){}
                }
            });

            mockContext = new core.AppContext();
            mockEventBus = new core.EventBus();
            mockContext.eventBus = mockEventBus;

            ajaxStub = sandbox.stub(net, 'ajax');

            sandbox.stub(DialogUtils, 'showWarningDialogWithActionAndCancel');
            sandbox.stub(DialogUtils, 'showMultiLineErrorAlert');

            region = new ExecutionLogRegion({
                context: mockContext

            });

            contextActionsToTest = new ExecutionLogContextActions({
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
            expect(ExecutionLogContextActions).to.be.defined;
        });

        describe("ExecutionLogContextActions Tests", function () {

            describe('#viewDetails() test', function () {

                it("should show warning for single activation", function () {

                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
                    });

                    contextActionsToTest.viewDetails();

                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: "/policynbi/sd/v1.0/log/id1",
                        type: "GET",
                    })).to.equal(true);
                });
            });

            describe('#onGetDetailsSuccess() test', function () {
                it("should open a flyout panel", function () {
                    var arg1, arg2;
                    sandbox.stub(container, 'getEventBus', function () {
                        return {
                            publish: function (x, y) {
                                arg1 = x;
                                arg2 = y;
                            }
                        }
                    });
                    contextActionsToTest.onGetDetailsSuccess({});
                    expect(arg1).to.equal("flyout:show");
                    expect(arg2.header).to.equal("Execution Logs");
                });
            });

            describe('#onGetDetailsError() test', function () {
                it("shows forbidden dialog for 401 error", function () {
                    sandbox.stub(DialogUtils, "showForbiddenDialog");
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
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

                    contextActionsToTest.viewDetails();
                    expect(DialogUtils.showForbiddenDialog.getCall(0).args[0]).to.equal('read Execution Log Details');
                });
                it("shows standard error dialog for regular error", function () {
                    sandbox.stub(contextActionsToTest, 'getSelectedIds', function () {
                        return ["id1"];
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

                    contextActionsToTest.viewDetails();

                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[0]).to.equal("The server encountered an internal error.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[1]).to.equal("Please try again later or contact your System Administrator.");
                    expect(DialogUtils.showMultiLineErrorAlert.getCall(0).args[2]).to.equal("Failed to read Execution Log Details");
                });
            });
        });
    });
})
;
