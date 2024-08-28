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
 * User: EEICMSY
 * Date: 12/9/18
 */
define([
    "eso-commonlib/FieldValidator",

], function (FieldValidator) {
    'use strict';

    var fieldValidatorToTest;

    describe('FieldValidator Test', function () {


        it("should be defined", function () {
            expect(FieldValidator).to.be.defined;
        });

        describe("FieldValidator Tests", function () {

            beforeEach(function () {

                fieldValidatorToTest = new FieldValidator({

                });
            });

            describe('validateSupportedByForm() test methods', function () {

                it("validateSupportedByForm test 1", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("hello there")).to.equal(true);
                });

                it("validateSupportedByForm test 2", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("<script>'hello there'</script>")).to.equal(false);
                });

                it("validateSupportedByForm test 3", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm(123456)).to.equal(true);
                });

                it("validateSupportedByForm test 4", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("hello % there")).to.equal(false);
                });

                it("validateSupportedByForm test 5", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("hello * there")).to.equal(false);
                });

                it("validateSupportedByForm test 6", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("hello _ there")).to.equal(true);
                });

                it("validateSupportedByForm test 7", function () {
                    expect(fieldValidatorToTest.validateSupportedByForm("hello & there")).to.equal(false);
                });


                it("validateSupportedByForm test 8", function () {
                    /* some JSON */
                    var json = {name: "fred", age: 21};

                    expect(fieldValidatorToTest.validateSupportedByForm(JSON.stringify(json))).to.equal(true);

                });

            });

            describe('alphaNumericValidationFunction() test methods', function () {

                var errorMessage, callbacks;
                beforeEach(function () {

                    callbacks = {
                        error: function (message) {
                            errorMessage = message;
                        },
                        success: function () {
                            errorMessage = '';
                        }
                    };
                });

                it("should show 'Please fill in all mandatory fields' with empty string", function () {

                    var badChars = {
                        getValue: function () {
                        return "";
                        }
                    };

                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.alphaNumericValidationFunction(badChars, callbacks);
                        expect(errorMessage).to.equal('Please fill in all mandatory fields.');
                    }
                });

                it("should show 'Invalid characters in value' with invalid characters in text", function () {

                    var badChars = {
                        getValue: function () {
                            return "?$&&&&?";
                        }
                    };

                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.alphaNumericValidationFunction(badChars, callbacks);
                        expect(errorMessage).to.equal('Invalid characters in value');
                    }
                });

                it("should not show warning with valid characters in text", function () {

                    var goodChars = {
                        getValue: function () {
                        return "abc*";
                        }
                    };
                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.alphaNumericValidationFunction(goodChars, callbacks);
                        expect(errorMessage).to.equal('');
                    }
                });
            });

            describe('numericValidationOrBlankFunction() test methods', function () {

                var errorMessage, callbacks;
                beforeEach(function () {

                    callbacks = {
                        error: function (message) {
                            errorMessage = message;
                        },
                        success: function () {
                             errorMessage = '';
                        }
                    };

                });

                it("should show 'Invalid characters in value' with invalid characters in text", function () {

                    var badChars = {
                        getValue: function () {
                            return "xyz?";
                        }
                    };

                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.numericValidationOrBlankFunction(badChars, callbacks);
                        expect(errorMessage).to.equal("Value must be a numeric value greater than 0");
                    }
                });

                it("should show 'Invalid characters in value' with invalid 0 value", function () {

                    var badChars = {
                        getValue: function () {
                            return "0";
                        }
                    };

                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.numericValidationOrBlankFunction(badChars, callbacks);
                        expect(errorMessage).to.equal("Value must be a numeric value greater than 0");
                    }
                });

                it("should not show warning with valid numreric characters in text", function () {

                    var goodChars = {
                        getValue: function () {
                            return "2";
                        }
                    };
                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.numericValidationOrBlankFunction(goodChars, callbacks);
                        expect(errorMessage).to.equal('');
                    }
                });

                it("should not show warning with blank character in text", function () {

                    var goodChars = {
                        getValue: function () {
                            return "";
                        }
                    };
                    if (fieldValidatorToTest) {
                        fieldValidatorToTest.numericValidationOrBlankFunction(goodChars, callbacks);
                        expect(errorMessage).to.equal('');
                    }
                });
            });

        });

    });
});