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
    "eso-commonlib/JSONValueCell"
],
    function (JSONValueCell) {
        'use strict';

        describe('JSONValueCell cell widget', function () {

            var jsonValueCell, sandbox, valueAppended;

            beforeEach(function () {
                sandbox = sinon.sandbox.create();
                jsonValueCell = new JSONValueCell();

                var dummyElement = {

                        append: function (value) {

                            if (typeof value === 'string') {
                                valueAppended = value;
                            }
                        }
                    };

                    sandbox.stub(jsonValueCell, 'getHTMLElement', function () {
                        return dummyElement;
                    });
            });

            afterEach(function () {
                sandbox.restore();
                jsonValueCell.onCellDestroy();
            });

            it("should not be undefined", function () {
                expect(jsonValueCell).not.to.be.undefined;
            });

            describe('True value test methods', function () {

                describe('setValue() tests ', function () {

                    it("true value shows as a green tick", function () {    // in time if only want this for say status colums would edit value in production code to add other column values into this value

                        jsonValueCell.setValue(true);
                        expect(valueAppended).to.equal("true");
                    });

                    it("Other values do not show a green tick", function () {

                        jsonValueCell.setValue("whatever");
                        expect(valueAppended).to.equal("true");
                    });

                });


            });
        });
    });

