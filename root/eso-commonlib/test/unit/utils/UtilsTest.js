/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: eeicmsy
 * Date: 24/11/17
 */
define([
    'jscore/core',
    "eso-commonlib/Utils"
], function (core, Utils) {
    'use strict';

    var sandbox, sampleJSONArray;

    describe('Utils Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            sandbox.stub(console, "log");


            sampleJSONArray = [
                {
                    id: "081a7fea-d142-4b26-9f6c-3da2cd29e82d",
                    name: "ApnName",
                    default: "apn.operator.com",
                    description: "Access Point Name (APN)\nfor GGSN/PDN Gateway ",
                    type: "string"
                },
                {
                    id: "081a7fea-d142-4b26-9f6c-3da2fffffff",
                    name: "DC_Location",
                    default: [
                        "Athlone",
                        "Gothenburg"
                    ],
                    description: "Location of virtual Data\nCentre (vDC) ",
                    type: "string"
                }

            ];

        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(Utils).to.be.defined;
        });

        describe('log() test', function () {

            it("Should call console.log with message", function () {
                Utils.ISDEBUGGING = true;


                var response = {
                    getResponseText: function () {
                        return "error happened";
                    }
                }

                Utils.log("message", response);
                expect(console.log.getCall(0).calledWith("message, Reason: error happened")).to.equal(true);
            });

        });


        describe('convertToKeyValueArray() test', function () {

            it("Should convert JSON object into a thing with key and value", function () {

                var objBefore = {
                    "ApnName": "apn.operator.com",
                    "ChargingEnabled": false,
                    "DC_Location": ["Athlone", "Gothenburg"],
                    "GiAddressRange": "10.10.1.0/29"
                };


                var expectedAfter = [
                    {
                        "key": "ApnName",
                        "value": "apn.operator.com"
                    },
                    {
                        "key": "ChargingEnabled",
                        "value": false
                    },
                    {
                        "key": "DC_Location",
                        "value": ["Athlone", "Gothenburg"]
                    },
                    {
                        "key": "GiAddressRange",
                        "value": "10.10.1.0/29"
                    }
                ];


                var result = Utils.convertToKeyValueArray(objBefore);

                expect(result).to.deep.equal(expectedAfter);
            });

        });

        describe('mergeObjects() test', function () {

            it("Should merge two json objects", function () {
                var obj1 = {"title": "hello"};

                var obj2 = {
                    "CLEAR_ALL": "Clear all",
                    "NO": "No"
                };


                var expectedResult = {
                    "title": "hello",
                    "CLEAR_ALL": "Clear all",
                    "NO": "No"
                };

                var result = Utils.mergeObjects(obj1, obj2);

                expect(expectedResult).to.deep.equal(result);
            });

        });

        describe('removeAllChildrenFromElement() test', function () {

            it("Should remove all children from div", function () {
                var btn = document.createElement("button");
                var text = document.createTextNode("text");
                btn.appendChild(text);

                // before
                expect(btn.hasChildNodes()).to.equal(true);

                Utils.removeAllChildrenFromElement(btn);

                // after
                expect(btn.hasChildNodes()).to.equal(false);

            });
        });


        describe('convertToSelectBoxItems() test', function () {

            it("Should convert array to JSON array suitable for SelectBox widget", function () {

                var result = Utils.convertToSelectBoxItems([1, 2, 3]);

                var expectedResult = [
                    {name: 1, value: 1, title: 1},
                    {name: 2, value: 2, title: 2},
                    {name: 3, value: 3, title: 3}

                ];

                expect(expectedResult).to.deep.equal(result);

            });

        });


        describe('convertToSelectBoxItemsWhenHaveNamesWithIds() test', function () {

            it("Should convert array to JSON array suitable for SelectBox widget", function () {


                var result = Utils.convertToSelectBoxItemsWhenHaveNamesWithIds(sampleJSONArray);

                var expectedResult = [
                    {name: "ApnName", value: "081a7fea-d142-4b26-9f6c-3da2cd29e82d", title: "Access Point Name (APN)\nfor GGSN/PDN Gateway "},
                    {name: "DC_Location", value: "081a7fea-d142-4b26-9f6c-3da2fffffff", title: "Location of virtual Data\nCentre (vDC) "}

                ];

                expect(expectedResult).to.deep.equal(result);

            });

        });


        describe('removeNewLines() test', function () {

            it("Should remove new line chars", function () {


                var result = Utils.removeNewLines(sampleJSONArray);

                var expectedResult = [
                    {
                        id: "081a7fea-d142-4b26-9f6c-3da2cd29e82d",
                        name: "ApnName",
                        default: "apn.operator.com",
                        description: "Access Point Name (APN) for GGSN/PDN Gateway ",    // new line removed
                        type: "string"
                    },
                    {
                        id: "081a7fea-d142-4b26-9f6c-3da2fffffff",
                        name: "DC_Location",
                        default: [
                            "Athlone",
                            "Gothenburg"
                        ],
                        description: "Location of virtual Data Centre (vDC) ",   // new line removed
                        type: "string"
                    }


                ];

                expect(expectedResult).to.deep.equal(result);

            });

        });


        describe('deleteKeysInJavaScriptObjectExceptKeys() test', function () {

            it("Should delete keys in the javascript object except the chosen keys to keep", function () {


                Utils.deleteKeysInJavaScriptObjectExceptKeys(sampleJSONArray[0], ["name", "type"]);

                var expectedResult = {
                    name: "ApnName",
                    type: "string"

                };
                expect(expectedResult).to.deep.equal(sampleJSONArray[0]);  // changed sampleJSONArray[0]

            });

        });

        describe('deleteKeysInJavaScriptObject() test', function () {

            it("Should delete the chosen keys in the javascript object", function () {

                Utils.deleteKeysInJavaScriptObject(sampleJSONArray[1], ["id", "default"]);

                var expectedResult = {
                    name: "DC_Location",
                    description: "Location of virtual Data\nCentre (vDC) ",
                    type: "string"
                };

                expect(expectedResult).to.deep.equal(sampleJSONArray[1]);  // changed sampleJSONArray[1]

            });

        });


        describe('showElementInlineBlock() test', function () {

            it("Can show element as inline-block", function () {

                var elem = new core.Element();

                Utils.showElementInlineBlock(elem, true);

                var displayStyle = elem.getStyle("display");

                expect(displayStyle).to.equal("inline-block");

            });

            it("Can hide element", function () {

                var elem = new core.Element();

                Utils.showElementInlineBlock(elem, false);

                var displayStyle = elem.getStyle("display");

                expect(displayStyle).to.equal("none");

            });

        });

        describe('showElementInline() test', function () {

            it("Can show element as inline", function () {

                var elem = new core.Element();

                Utils.showElementInline(elem, true);

                var displayStyle = elem.getStyle("display");

                expect(displayStyle).to.equal("inline");

            });

            it("Can hide element", function () {

                var elem = new core.Element();

                Utils.showElementInlineBlock(elem, false);

                var displayStyle = elem.getStyle("display");

                expect(displayStyle).to.equal("none");

            });

        });


        describe('getItemValueFromQueryParams() test', function () {

            it("Should fetch parameters from query parameters", function () {

                var queryParams = "?offset=0&limit=50&sortAttr=name&sortDir=asc&filters={'name':'massive'}";
                var paramKey = "filters";


                var result = Utils.getItemValueFromQueryParams(queryParams, paramKey);

                var expectedResult = "{'name':'massive'}";

                expect(expectedResult).to.deep.equal(result);

            });

        });

        describe('getCookie() test', function () {


            it("Should be able to fetch cookies", function () {

                document.cookie = "cookieTest=" + "hello" + ";path=/";


                var result = Utils.getCookie('cookieTest');


                expect(result).to.equal("hello");

                document.cookie = "cookieTest=; Max-Age=0;path=/";

                var resultRemoved = Utils.getCookie('cookieTest');
                expect(resultRemoved).to.equal("");  // removed
            });

        });

    });
});





