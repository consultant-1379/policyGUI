/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'jscore/core',
    'jscore/ext/net',
    'sap-decision-rules/SapDecisionRules',
    'tablelib/layouts/PaginatedTable'
], function (core, net, SapDecisionRules, PaginatedTable) {
    'use strict';

    var sandbox, appToTest, mockEventBus, mockContext;

    describe('SapDecisionRules Test (unit tests)', function () {


        beforeEach(function () {

            sandbox = sinon.sandbox.create();

            mockContext = new core.AppContext();
            mockEventBus = new core.EventBus();
            mockContext.eventBus = mockEventBus;


            sandbox.stub(mockEventBus, 'publish');
            sandbox.stub(mockEventBus, 'subscribe');

            /* Object.keys method failing inside PaginatedTable when running test from command line */
            sandbox.stub(PaginatedTable.prototype, "getDataInfoById", function () {
                return {};
            });

            sandbox.stub(net, 'ajax');


            appToTest = new SapDecisionRules({
                context: mockContext,
                properties: {
                    title: "Service Template Management"    // would really be from prop file
                }
            });

            sandbox.stub(appToTest, 'getContext', function () {
                return mockContext;
            });


        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(SapDecisionRules).to.be.defined;
        });

        describe("SapDecisionRules Tests", function () {

            beforeEach(function () {
                appToTest.onStart();

            });

            afterEach(function () {

                appToTest.onBeforeLeave();

            });


            describe('#onBeforeLeave() test', function () {


                it("should remove event bus subscriptions", function () {

                    appToTest.onStart();

                    expect(appToTest.eventBusSubscriptions).to.be.defined;

                    appToTest.onBeforeLeave();

                    expect(appToTest.eventBusSubscriptions).not.to.be.defined;

                });

            });

            describe('#onResume() test', function () {


                it("should add event bus subscriptions", function () {

                    appToTest.onBeforeLeave();

                    expect(appToTest.eventBusSubscriptions).not.to.be.defined;

                    appToTest.onResume();

                    expect(appToTest.eventBusSubscriptions).to.be.defined;

                });

            });

            describe('#showLoadingAnimation() test', function () {


                it("should create a loader when true passed", function () {

                    expect(appToTest.loader).not.to.be.defined;

                    appToTest.showLoadingAnimation(true, "hello");

                    expect(appToTest.loader).to.be.defined;


                });

                it("should delete a loader when false passed", function () {

                    appToTest.showLoadingAnimation(true, "hello");

                    expect(appToTest.loader).to.be.defined;

                    appToTest.showLoadingAnimation(false);

                    expect(appToTest.loader).not.to.be.defined;


                });

            });

        });

    });


});
