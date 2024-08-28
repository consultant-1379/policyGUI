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
    "jscore/core",
    "eso-commonlib/BoldFontCell"
],
    function (core, BoldFontCell) {
        'use strict';


        describe('BoldFontCell cell widget', function () {

            var boldfontCell, sandbox, valueAppended;

            beforeEach(function () {
                sandbox = sinon.sandbox.create();
                boldfontCell = new BoldFontCell();

                /* for table cell creations - running test from command line without window caused problems calling #getNative */
                boldfontCell.isUnitTesting = true;

                var dummyElement = {
                        append: function (stringValue) {
                            valueAppended = stringValue;
                        }
                    };

                sandbox.stub(boldfontCell, 'getHTMLElement', function () {
                    return dummyElement;
                });
            });

            afterEach(function () {
                sandbox.restore();
                boldfontCell.onCellDestroy();
            });

            it("should not be undefined", function () {
                expect(boldfontCell).not.to.be.undefined;
            });


            describe('BoldFontCell test methods', function () {

                describe('setValue() tests ', function () {

                    it("Changes to bold font", function () {

                        var elem = boldfontCell.setValue("whatever");  // elem returned when isUnitTesting is set
                        expect(elem.getParent().getNative().innerHTML).to.equal("<b></b>");

                    });

                    it("Changes first letter to upper case : 'creationDate' becomes 'CreationDate'", function () {

                        boldfontCell.setValue("creationDate");
                        expect(valueAppended).to.equal("CreationDate");

                    });

                    it("should test getHTMLElement and getNative value'", function () {

                        sandbox.restore();
                        var returnVal = boldfontCell.getHTMLElement({
                            getNative: function () {
                                window.nativeVar = "getNative called";
                                return true;
                            }
                        });
                        expect(window.nativeVar).to.be.defined;
                        delete window.nativeVar;
                    });

                });


            });
        });
    });
