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
    'jscore/core',
    "eso-commonlib/FormInputRegion",
    "eso-commonlib/widgets/formInput/FormInputWidget",
    'layouts/Form',
    'formvalidator/Validator'


], function (core, FormInputRegion, FormInputWidget, Form, Validator) {
    'use strict';

    var sandbox, formInputRegionToTest;

    describe('FormInputRegion Test', function () {

        beforeEach(function () {

            sandbox = window.sinon.sandbox.create();

            /* BIG problems trying to run tests out side browser (from command line)


             *   Error1 #start : starting formInput region (on command cdt2 build - not in browser):
             *   TypeError: 'undefined' is not a function (evaluating 'n.remove()')
             FAILED 2 it should keep static data when set parameters
             TypeError: 'undefined' is not a function (evaluating 'n.remove()')
             at http://localhost:50889/src/layouts/1/Form.js:4
             at r (http://localhost:50889/src/layouts/1/Form.js:3)
             at http://localhost:50889/src/layouts/1/Form.js:3
             at http://localhost:50889/src/layouts/1/Form.js:4
             at o (http://localhost:50889/src/jscore/1/core.js:3)
             */


            sandbox.stub(Validator.prototype);

            var dummyForm = {
                data: {Name: "", "Service Description": "", "Service Model": "081a7fea-d142-4b26-9f6c-3da2cd29e82d-10", "Password": "hello"},

                remove: function () {
                },

                getFields: function () {
                    return [
                        {input: {
                            getAttribute: function () {
                            },
                            setAttribute: function () {
                            },
                            getValue: function () {
                                return {
                                    match: function () {
                                        return null;
                                    }
                                };
                            },
                            setMinWidth: function () {
                            },
                            setBoxSize: function () {
                            },
                            addEventHandler: function () {
                            },
                            getNative: function () {
                                return {
                                    type: ""
                                };
                            }

                        }  }


                    ];

                },
                attachTo: function () {
                },
                setData: function () {
                },
                getData: function () {

                    return this.data;
                }
            };


            sandbox.stub(FormInputWidget.prototype, 'constructForm', function () {    // to get around above
                return dummyForm;
            });

            formInputRegionToTest = new FormInputRegion({
                staticParameters: getStaticParams()});


            formInputRegionToTest.start(new core.Element());


        });

        afterEach(function () {

            sandbox.restore();
            formInputRegionToTest.stop();

        });


        it("should be defined", function () {
            expect(FormInputRegion).to.be.defined;
        });

        describe("FormInputRegion Tests", function () {


            describe('setParameters() test method', function () {

                /* majorly reduced test due to issues runnign from command line */
                it("should keep static data when set parameters", function () {

                    formInputRegionToTest.setParameters(getInputParameters());

                    var totalData = formInputRegionToTest.getData();
                    var actualKeys = Object.keys(totalData);

                    expect(actualKeys.indexOf("Name") !== -1).to.equal(true);

                    expect(actualKeys.indexOf("Service Model") !== -1).to.equal(true);

                });

            });

            describe('getDataForDisplayToUser() test method', function () {

                // method not working when run from command line (works in browser - fails with #remove missing in private Field class in SDK */
                it("should not show passwords if present", function () {

                    var displayData = formInputRegionToTest.getDataForDisplayToUser();

                    var keys = Object.keys(displayData);

                    expect(keys.indexOf("Password") !== -1).to.equal(true);

                    expect(displayData.Password).to.equal("(Hidden Text)");

                });

            });


//            describe('isValid() test method', function () {
//
//                // method not working when run from command line (works in browser - fails with #remove missing in private Field class in SDK */
//                it("should call formWidget directly if present", function () {
//
//                    formInputRegionToTest.isValid(function () {
//                    });
//
//                });
//
//            });

            describe('getFormWidget() test method', function () {

                it("should createFormWidget", function () {

                    sandbox.stub(formInputRegionToTest, "createFormInputWidget", function () {
                        return{
                            setData: function (x) {
                                return true;

                            },
                            detach: function () {
                                return true;
                            },
                            create: function () {
                                window.createWidget = "created";
                            },
                            attachTo: function (x) {
                                return true;
                            },
                            destroy: function () {
                                return true;
                            }
                        }
                    });
                    formInputRegionToTest.setParameters(getInputParameters());
                    formInputRegionToTest.getFormWidget();
                    expect(window.createWidget).to.be.defined;
                    delete window.createWidget;
                });
            });

            describe('isFormBeingEdited() test method', function () {

                it("should check if form is edited", function () {

                    sandbox.stub(formInputRegionToTest, "createFormInputWidget", function () {
                        return {
                            isFormBeingEdited: function () {
                                return true;
                            },
                            setData: function (x) {
                                return true;
                            },
                            detach: function () {
                                return true;
                            },
                            attachTo: function (x) {
                                return true;
                            },
                            destroy: function () {
                                return true;
                            }
                        }
                    });
                    formInputRegionToTest.setParameters(getInputParameters());

                    expect(formInputRegionToTest.isFormBeingEdited()).to.equal(true);
                });
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

        staticParams['Service Template'] = {
            id: 'Service Template',
            type: "select",
            placeholder: "Select from list",
            validationMessage: 'Service Template is a required attribute',
            items: serviceTemplateItems,
            default: 2,
            description: 'Select service template item',
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
                default: "22",
                description: "Gi (GGSN-to-PDN) VPN ID ",
                type: "string"
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

})
;

