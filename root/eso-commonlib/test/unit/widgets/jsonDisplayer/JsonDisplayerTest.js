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
    "jscore/core",
    "eso-commonlib/JsonDisplayer",
    "eso-commonlib/BoldFontCell"

], function (core, JsonDisplayer, BoldFontCell) {
    'use strict';

    var sandbox, jsonDisplayerToTest,  jsonData, elementAdded;

    describe('JsonDisplayer Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            sandbox.stub(BoldFontCell.prototype, 'setValue');

            sandbox.stub(JsonDisplayer.prototype, 'getRawJSONHolderInnerHTML', function(){
                return {
                    append : function(elem){
                        elementAdded = elem;
                    }
                };
            });

            jsonData = {
                current: "step0",
                steps: [
                    {
                        id: "step0",
                        name: "create",
                        type: "Node",
                        title: "create: fm-block-storage-1",
                        node: "fm-block-storage-1",
                        implementation: "scripts/create_storage.py",
                        inputs: [
                            {
                                name: "size",
                                value: "1",
                                type: "integer"
                            }
                        ],
                        complete: false
                    },
                    {
                        id: "step1",
                        "name": "configure",
                        "type": "Node",
                        "title": "configure: fm-block-storage-1",
                        "node": "fm-block-storage-1",
                        "implementation": "scripts/configure_storage.py",
                        "inputs": []
                    },
                    {
                        id: "step2",
                        "name": "start",
                        "type": "Node",
                        "title": "start: fm-block-storage-1",
                        "node": "fm-block-storage-1",
                        "implementation": "",
                        "inputs": [],
                        "complete": false
                    },
                    {
                        id: "step3",
                        "name": "create",
                        "title": "create: fm-node-1",
                        "type": "Node",
                        "node": "fm-node-1",
                        "implementation": "scripts/create_fm_node.py",
                        "inputs": [],
                        "complete": false
                    },
                    {
                        id: "step4",
                        "name": "configure",
                        "type": "Node",
                        "random": [
                            {
                                "random1": "configure1",
                                "random2": [
                                    {
                                        "name": "random2 nest fm-node-ip",
                                        "value": "random2 nest  10.0.0.1",
                                        "type": "random2 nest  string"
                                    }
                                ],
                                "random3": "configure3"
                            }
                        ],
                        "title": "configure: fm-node-1",
                        "node": "fm-node-1",
                        "implementation": "scripts/configure_fm_node.py",
                        "inputs": [
                            {
                                "name": "fm-node-ip",
                                "value": "10.0.0.1",
                                "type": "string"
                            }
                        ],
                        "complete": false
                    },
                    {
                        id: "step5",
                        "name": "start",
                        "type": "Node",
                        "title": "start: fm-node-1",
                        "node": "fm-node-1",
                        "implementation": "scripts/start_fm_node.py",
                        "inputs": [],
                        "complete": false
                    },
                    {
                        id: "step6",
                        "name": "add_target",
                        "type": "Relationship",
                        "title": "add_target: fm-node-1 <- fm-block-storage-1",
                        "target_node": "fm-block-storage-1",
                        "implementation": "scripts/attach_fm_storage.py",
                        "inputs": [],
                        "complete": false
                    }
                ]
            };


        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(JsonDisplayer).to.be.defined;
        });

        describe("JsonDisplayer Tests", function () {

            describe('onViewReady() test method', function () {

                it("should create trees and tables from JSON data", function () {

                    jsonDisplayerToTest = new JsonDisplayer({
                        data: jsonData,
                        showMenuBar : true
                    });

                    jsonDisplayerToTest.onViewReady();

                    expect(jsonDisplayerToTest.getTableHolder().getNative().children.length).to.equal(2);

                    expect(jsonDisplayerToTest.getTreeHolder().getNative().children.length).to.equal(2);

                });

                it("should be able to show raw data too", function () {

                    jsonDisplayerToTest = new JsonDisplayer({

                        data: jsonData,
                        showRawJson : true
                    });

                    jsonDisplayerToTest.onViewReady();

                    expect(elementAdded.innerHTML.length).to.equal(2973);


                });

                it("should be able to create getRawJSONHolder", function () {

                    jsonDisplayerToTest = new JsonDisplayer({

                        data: jsonData,
                        showRawJson : true
                    });

                    jsonDisplayerToTest.onViewReady();

                    expect(jsonDisplayerToTest.getRawJSONHolder().getNative().parentNode.children.length).to.equal(3);
                });

                it("should be able to create getToastHolder", function () {

                    jsonDisplayerToTest = new JsonDisplayer({

                        data: jsonData,
                        showRawJson : true
                    });

                    jsonDisplayerToTest.onViewReady();

                    expect(jsonDisplayerToTest.getToastHolder().getNative().parentNode.children.length).to.equal(3);

                });

            });

        });

    });

});


