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
 * Date: 05/03/18
 */
define([
    "eso-commonlib/FilterTextField"
], function (FilterTextField) {
    'use strict';

    var sandbox, filterTextFieldToTest, textFieldHandler;

    describe('FilterTextField Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            textFieldHandler = function(text){
                this.textPassed = text;
            };

            filterTextFieldToTest = new FilterTextField({
                textFieldFilterHandler: textFieldHandler.bind(this)
            });

            filterTextFieldToTest.onViewReady();


        });

        afterEach(function () {

            sandbox.restore();
            filterTextFieldToTest.onDestroy();

        });

        it("should be defined", function () {
            expect(FilterTextField).to.be.defined;
        });

        describe("FilterTextField Tests", function () {


            describe('handleChangeInTextBoxText() test', function () {

                it("should pass text box values to the filter handler", function () {

                    filterTextFieldToTest.filterTextField.setValue("hello");

                    filterTextFieldToTest.handleChangeInTextBoxText({originalEvent : {keyCode : 13}});

                    expect(this.textPassed).to.equal("hello");
                });


            });

            describe('handleClearFilterIconClicked() test', function () {

                it("should clear text box values passed to the filter handler", function () {

                    filterTextFieldToTest.filterTextField.setValue("hello2");

                    filterTextFieldToTest.handleClearFilterIconClicked({originalEvent : {keyCode : 13}});

                    expect(this.textPassed).to.equal("");
                });


            });

            describe('handleApplyFilterIconClicked() test', function () {

                it("should pass text box values to the filter handler", function () {

                    filterTextFieldToTest.filterTextField.setValue("hello3");

                    filterTextFieldToTest.handleApplyFilterIconClicked ({originalEvent : {keyCode : 13}});

                    expect(this.textPassed).to.equal("hello3");
                });


            });


        });

    });

});


