/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2019
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: EEICMSY
 * Date: 2/15/19
 */
define([
    'jscore/core',
    'sap-execution-log/widgets/copyrightNotice/CopyrightNotice'

], function (core, CopyrightNotice) {
    'use strict';

    var sandbox, copyRightNoticeTest, okButtonAction, called;

    describe('CopyrightNotice Test (unit tests)', function () {


        beforeEach(function () {

            okButtonAction = function () {
                called = "i am called";
            };

            sandbox = window.sinon.sandbox.create();


            copyRightNoticeTest = new CopyrightNotice({
                okButtonAction: okButtonAction

            });


        });

        afterEach(function () {

            sandbox.restore();

            copyRightNoticeTest.onDestroy();


        });

        it("should be defined", function () {
            expect(CopyrightNotice).to.be.defined;
        });

        describe("CopyrightNotice Tests", function () {


            describe('#onViewReady() test', function () {

                it("should add action listener to ok button", function () {

                    copyRightNoticeTest.onViewReady();
                    expect(copyRightNoticeTest.okButtonEventId).not.to.be.undefined;


                });

            });

            describe('ok button press should call the action passed in constructor', function () {

                it("should add action listener to ok button", function () {


                    copyRightNoticeTest.addActionListeners();

                    copyRightNoticeTest.getOkButton().trigger("click");

                    expect(called).to.equal("i am called");

                });

            });


        });

    });


});

