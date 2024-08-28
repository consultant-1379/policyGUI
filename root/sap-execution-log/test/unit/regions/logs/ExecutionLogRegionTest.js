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
 * Date: 08/03/18
 */
define([
    'jscore/core',
    'jscore/ext/net',
    'widgets/Dialog',
    'eso-commonlib/DialogUtils',
    'sap-execution-log/regions/logs/ExecutionLogRegion',
    'tablelib/layouts/PaginatedTable'
], function (core, net, Dialog, DialogUtils, ExecutionLogRegion, PaginatedTable) {
    'use strict';

    var sandbox, regionToTest, mockEventBus, mockContext, ajaxStub;

    describe('ExecutionLogRegion Test', function () {

        beforeEach(function () {

            sandbox = sinon.sandbox.create();

            mockContext = new core.AppContext();
            mockEventBus = new core.EventBus();
            mockContext.eventBus = mockEventBus;


            sandbox.stub(mockEventBus, 'publish');
            sandbox.stub(mockEventBus, 'subscribe');
            sandbox.stub(Dialog.prototype, 'show');

            regionToTest = new ExecutionLogRegion({
                context: mockContext

            });

            /* Object.keys method failing inside PaginatedTable when running test from command line */
            sandbox.stub(PaginatedTable.prototype, "getDataInfoById", function () {
                return {};
            });


            sandbox.stub(regionToTest, 'getContext', function () {
                return mockContext;
            });

            ajaxStub = sandbox.stub(net, 'ajax');

            sandbox.stub(regionToTest, 'getEventBus', function () {
                return mockEventBus;
            });


        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(ExecutionLogRegion).to.be.defined;
        });

        describe("ExecutionLogRegion Tests", function () {

            beforeEach(function () {
                regionToTest.onStart();

            });

            afterEach(function () {

                regionToTest.onStop();

            });


            describe('#onPolicyFetchError() test', function () {

                it("should show general error if other error", function () {

                    ajaxStub.yieldsTo('error',
                        500,
                        {
                            getStatus: function () {
                                return 500;
                            }
                        }

                    );

                    regionToTest.handleRefresh();  // calls to populate grid

                    var inlineMessageHolder = regionToTest.getInlineMessageHolder();

                    var inlineMessage = inlineMessageHolder.children()[0].getText();
                    expect(inlineMessage.indexOf("The server encountered an internal error.") !== -1).to.equal(true);


                });
            });

            describe('#paginatedLayoutRowSelectionHandler() tests', function () {

                var paginationHandler;
                beforeEach(function () {
                        paginationHandler = regionToTest.paginatedLayoutRowSelectionHandler();

                });


                it("#handleGridPopulation should remove inline message if grid is populated", function () {

                    var inlineMessageHolder = regionToTest.getInlineMessageHolder();

                    regionToTest.showEmptyGridMessage(true);
                    regionToTest.showInlineMessage(DialogUtils.createForbiddenInlineMessage("random"));

                    expect(inlineMessageHolder.children()[0]).to.be.defined;

                    paginationHandler.handleGridPopulation(3);

                    expect(inlineMessageHolder.children()[0]).not.to.be.defined;


                });
            });
        });
    });

});