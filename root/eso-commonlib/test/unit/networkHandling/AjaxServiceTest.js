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
 * Date: 26/02/18
 */
define([
    'jscore/ext/net',
    "eso-commonlib/AjaxService"
], function (coreNet, ajaxService) {
    'use strict';

    var sandbox;

    describe('AjaxService Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();


        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(ajaxService).to.be.defined;
        });

        describe("AjaxService Tests", function () {

            beforeEach(function () {

                sandbox.stub(coreNet, 'ajax');

            });

            afterEach(function () {

                sandbox.restore();

            });


            describe('AjaxService #getCall test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.getCall({});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        type: "GET",
                        dataType: "json"

                    })).to.equal(true);
                });


            });

            describe('AjaxService #postCall test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.postCall({});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        type: "POST",
                        dataType: "json",
                        processData: false,
                        contentType: 'application/json'

                    })).to.equal(true);
                });


            });

            describe('AjaxService #deleteCall test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.deleteCall({});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        type: "DELETE"

                    })).to.equal(true);
                });
            });

            describe('AjaxService #putCall test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.putCall({});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        type: "PUT",
                        dataType: "json",
                        processData: false,
                        contentType: 'application/json'

                    })).to.equal(true);
                });
            });

            describe('AjaxService #patchCall test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.patchCall({});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        type: "PATCH",
                        dataType: "json",
                        processData: false,
                        contentType: 'application/json'

                    })).to.equal(true);
                });
            });

            describe('AjaxService #ajax  (general) test method', function () {
                it("should pass required parameters to core net (via adapter)", function () {
                    ajaxService.ajax({test: "random"});

                    expect(coreNet.ajax.getCall(0).calledWithMatch({
                        test: "random"

                    })).to.equal(true);
                });
            });
        });
    });
});
