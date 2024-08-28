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
    "eso-commonlib/widgets/formInput/FormInputWidget"
], function (FormInputWidget) {
    'use strict';

    var sandbox, formInputWidgetToTest;

    describe('FormInputWidget Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(FormInputWidget).to.be.defined;
        });

        describe("FormInputWidget Tests", function () {

            beforeEach(function () {
                try {
                    formInputWidgetToTest = new FormInputWidget({
                        parameters: getStaticParams()
                    });
                } catch (err) {
                    console.log("Error 1 starting fomInput widget (on command cdt2 build - not in browser): " + err);
                }

            });

            describe('onViewReady() test method', function () {


                it("should populate form data with static data from input parameters", function () {

                    if (formInputWidgetToTest) {
                        formInputWidgetToTest.onViewReady();


                        var formContentString = formInputWidgetToTest.form.options.content.toString();

                        // found static data in form
                        expect(formContentString.indexOf("Network slice (instance) name")).to.equal(47);

                        expect(formInputWidgetToTest.form.getFields().length).to.equal(2);

                    };

                });

            });


            describe('alphaNumericValidation() test methods', function () {

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

                it("should show 'value required' when too few characters in text", function () {

                    var tooFewChars = {
                        getValue: function () {
                            return "h";
                        }
                    };

                    if (formInputWidgetToTest) {
                        formInputWidgetToTest.alphaNumericValidation(tooFewChars, callbacks);

                        expect(errorMessage).to.equal('Value required');
                    }
                });

                it("should show 'Invalid characters in value' when too few characters in text", function () {

                    var badChars = {
                        getValue: function () {
                            return "?$&&&&?";
                        }
                    };

                    if (formInputWidgetToTest) {
                        formInputWidgetToTest.alphaNumericValidation(badChars, callbacks);
                        expect(errorMessage).to.equal('Invalid characters in value');
                    }
                });

                it("should not show warning when good text", function () {

                    var goodChars = {
                        getValue: function () {
                            return "good_text";
                        }
                    };
                    if (formInputWidgetToTest) {
                        formInputWidgetToTest.alphaNumericValidation(goodChars, callbacks);
                        expect(errorMessage).to.equal('');
                    }
                });


            });


        });


        describe('objectValidation() test methods', function () {

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

            it("should show 'value required' when too few characters in text", function () {

                var badJSON = {
                    getValue: function () {
                        return "{key:value, key2}";
                    }
                };
                if (formInputWidgetToTest) {
                    formInputWidgetToTest.objectValidation(badJSON, callbacks);

                    expect(errorMessage).to.equal('Value must be valid JSON');
                }
            });


            it("should not show warning when good JSON", function () {

                var goodJSON = {
                    getValue: function () {
                        return JSON.stringify({
                            "serviceInstanceName": "Monday",
                            "serviceInstanceId": "9999",
                            "initializationTime": "2018-01-15 15:23:02",
                            "serviceModelName": "massive-mtc",

                            "lastExecutedWorkflow": {
                                "workflowName": "install",
                                "status": 22,
                                "executionState": 2,
                                "errorDetails": "Failed to fail"
                            }
                        });
                    }
                };
                if (formInputWidgetToTest) {
                    formInputWidgetToTest.objectValidation(goodJSON, callbacks);
                    expect(errorMessage).to.equal('');
                }
            });

        });


    });

    function getStaticParams() {
        var serviceTemplateItems = [];
        var staticParams = {};

        staticParams['Name'] = {
            id: 'Name',
            type: "input",
            default: "",
            description: 'Network slice (instance) name',
            mandatory: true,
            validationMessage: 'Name is a required attribute'
        };

        staticParams['Policy'] = {
            id: 'Policy',
            type: "select",
            placeholder: "Select from list",
            validationMessage: 'Policy is a required attribute',
            items: serviceTemplateItems,
            default: 2,
            description: 'Select policy item',
            mandatory: true,
            callback: function () {
            }
        };

        return staticParams;

    }

    function getInputParameters() {
        return  [
            {
                name: "ApnName",
                default: "apn.operator.com",
                description: "Access Point Name (APN) for GGSN/PDN Gateway ",
                type: "string"
            },
            {
                name: "ChargingEnabled",
                default: false,
                description: "Charging ",
                type: "boolean"
            },
            {
                name: "DC_Location",
                default: [
                    "Athlone",
                    "Gothenburg"
                ],
                description: "Location of virtual Data Centre (vDC) ",
                type: "string"
            },
            {
                name: "GiAddressRange",
                default: "10.10.1.0/29",
                description: "DHCP Pool independent Gi Address (GGSN-to-PDN) ",
                type: "string"
            },
            {
                name: "GiVpnId",
                default: 22,
                description: "Gi (GGSN-to-PDN) VPN ID ",
                type: "integer"
            },
            {
                name: "ImsiNumberSeries",
                default: "272-01",
                description: "International Mobile Subscriber Identity ",
                type: "string"
            },
            {
                name: "RoamingEnabled",
                default: false,
                description: "Roaming ",
                type: "boolean"
            },
            {
                name: "VNFM_Host",
                default: "http://141.137.212.33:8081",
                description: "VNFManager Host IP, http://<IPv4 address>:<Port> ",
                type: "string"
            },
            {
                name: "vEPG_VIM",
                default: "CEE",
                description: "Vimzone for vMME Node in the slice ",
                type: "string"
            },
            {
                name: "vMME_VIM",
                default: "CEE",
                description: "Vimzone for vMME Node in the slice ",
                type: "string"
            },
            {
                name: "vPCRF_VIM",
                default: "myVzId",
                description: "Vimzone for vMME Node in the slice ",
                type: "string"
            }
        ];
    }


});

