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
 * Date: 27/02/18
 */
define([
    "eso-commonlib/ReplaceNullCell"
],
    function (ReplaceNullCell) {
        'use strict';


        describe('ReplaceNullCell cell widget', function () {

            var replaceNullCell, sandbox;

            beforeEach(function () {
                sandbox = sinon.sandbox.create();
                replaceNullCell = new ReplaceNullCell();
            });

            afterEach(function () {
                sandbox.restore();
                replaceNullCell.onCellDestroy();
            });

            it("should not be undefined", function () {
                expect(replaceNullCell).not.to.be.undefined;
            });

            describe('null value test methods', function () {

                describe('setValue() tests ', function () {


                    it("null value becomes an empty String", function () {

                        replaceNullCell.setValue(null);
                        expect(replaceNullCell.getElement().getNative().innerHTML.indexOf("null") !== -1).to.equal(false);
                        expect(replaceNullCell.getElement().getNative().innerHTML.indexOf("") !== -1).to.equal(true);

                    });

                    it("Other values do not change", function () {

                        replaceNullCell.setValue("whatever");
                        expect(replaceNullCell.getElement().getNative().innerHTML.indexOf("whatever") !== -1).to.equal(true);

                    });

                });


            });
        });
    });

