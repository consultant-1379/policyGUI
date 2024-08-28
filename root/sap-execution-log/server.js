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
 */

const util = require('util');
var setCookie = require('set-cookie');
const decisionRulesData = require('./test/resources/mockedJSONResponses/DecisionRulesData.js');
const executionLogData = require('./test/resources/mockedJSONResponses/ExecutionLogData.js');
const executionLogDetailsData = require('./test/resources/mockedJSONResponses/ExecutionLogDetailsData.js');

/**
 * This is the "mock" (fake) server used to test and develop  UI with expected JSON responses
 * a real server might send.
 *
 * It can be run using the script in the scripts folder  (./runServer.sh without a proxy).
 *
 * @param app  Read about Node.js and Express
 */
module.exports = function (app) {

    var DO_SERVICE_PREFIX_ROOT_VERSION = "/policynbi/sd/v1.0";

//    app.use(function (req, res, next) {

//        var isNoSecurityToken = function () {
//            if (this.addedToken === 'undefined') {
//                console.log("No security token cookie set yet !!");
//            }
//            return typeof this.addedToken === 'undefined';
//
//        };

        // TODO for now - never press log out on fake server (or will have to
        // restart server,js- as will have continuos loop)

//        if (isNoSecurityToken()) {
//            setCookie('so_user', 'TestServerUser', {       // TODO seems like
//                                                            // this thing only
//                                                            // takes one cookie
//                                                            // (token is
//                                                            // important one)
//                domain: 'localhost',
//                res: res
//            });
//
//            setCookie('so_token', '123', {
//                domain: 'localhost',
//                res: res
//            });
//
//            this.addedToken = true;
//        }
//        next();
//
//    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /////////////// Decision Rules Management  //////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     *
     * e.g. sd/v1.0/decision?offset=0&limit=50sortAttr=name&sortDir=asc&filters={}
     *
     * To suit client SDK paginated layout, would want our
     * server to sent response, like
     *   {
     *            total: 9000
     *            items: []
     *    }
     *
     * GET : List batched grid information for decision table
     *
     */
    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision", function (req, res) {

        //res.set('Content-Type', 'application/json');

        var DESIRED_NUMBER_OF_RECORDS = 201;  // TODO change at will

        if (typeof this.currentDecisionScaledItems == 'undefined') {
            this.currentDecisionScaledItems = scaleItems(decisionRulesData, DESIRED_NUMBER_OF_RECORDS, ["Active", "Inactive"]);

        }
        var mapValues = getObjectValues(this.currentDecisionScaledItems);
        return sendPaginatedData(req, res, mapValues);

    });

    /**
     * Required paginated grid layout call 2 (for paginated grid)
     */
    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision-ids", function (req, res) {
        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will

        if (!failTheCall) {
            res.send(getAllIds(this.currentDecisionScaledItems));
        } else {
            throwAnErrorToUI(res, 500);
        }
    });

    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision" + '/:decision_Id', function (req, res) {
        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will

        var decisionId = req.params.decision_Id;

        if (!failTheCall) {
            if (this.currentDecisionScaledItems[decisionId]) {
                res.send(this.currentDecisionScaledItems[decisionId]);
                return;
            }
        }
        throwAnErrorToUI(res, 500);
    });

    /**
     * DELETE Policy(s) - takes IDs in the body of the rest
     */
    app.delete(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision", function (req, res) {
        res.set('Content-Type', 'application/json');
        var failTheCall = false;  // change at will

        if (!failTheCall) {

            console.log("request body for delete : " + util.inspect(req.body));

            var errorOccurred = false;

            for (var j = 0; j < req.body.length; j++) {
                var idToDelete = req.body[j];
                console.log("Attempting to delete : " + util.inspect(idToDelete));

                if (this.currentDecisionScaledItems[idToDelete]) {
                    delete this.currentDecisionScaledItems[idToDelete];
                } else {
                    errorOccurred = true;
                    console.log("Failed to delete id: " + idToDelete + " this.currentDecisionScaledItems[" + idToDelete + "] is " + this.currentDecisionScaledItems[idToDelete]);
                }
            }

            if (!errorOccurred) {
                res.send(JSON.stringify("Request Accepted"));
            } else {
                throwAnErrorToUI(res, 500);
            }

        } else {
            throwAnErrorToUI(res, 500);
        }
    });

    app.patch(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision" + '/:decision_Id', function (req, res) {
        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will

        var decisionId = req.params.decision_Id;

        if (failTheCall || !this.currentDecisionScaledItems[decisionId]) {
            throwAnErrorToUI(res, 500);
        } else {
            for (attr in req.body) {
                this.currentDecisionScaledItems[decisionId][attr] = req.body[attr]
            }
            res.send(this.currentDecisionScaledItems[decisionId]);
        }
    });

    app.patch(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision", function (req, res) {
        patchList(req, res, this.currentDecisionScaledItems);
    });

 // ////////////////////// policy-gui-login
    // ///////////////////////////////////

    app.post(function (req, res) {
        res.set('Content-Type', 'application/json');


        var failTheCall = (1 + 1 === 200); // numbers for sonar - change at
                                            // will to fail or pass

        if (!failTheCall) {
            var response = {
                "redirectUrl": "#sap-execution-log",
                "token": "ABC*ZX£4AAADASDASC.*"
            };
            res.send(JSON.stringify(response));
        }
        else {
            throwAnErrorToUI(res, 500);
        }
    });


    /**
     *  Upload : Create Policy uses case passing yaml file
     */
    app.post(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision/comm", function (req, res) {
        createDecisionRule(req, res);
    });

    app.post(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision/pm", function (req, res) {
        createDecisionRule(req, res);
    });

    app.post(DO_SERVICE_PREFIX_ROOT_VERSION + "/decision/fm", function (req, res) {
        createDecisionRule(req, res);
    });

    function createDecisionRule(req, res) {
        var failTheCall = false;  // change at will

        if (!failTheCall) {
            res.set('Content-Type', 'application/json');
            var id = new Date().getUTCMilliseconds();
            req.body.id = id;
            this.currentDecisionScaledItems[id] = req.body;
            console.log("POLICY POST " + JSON.stringify(this.currentDecisionScaledItems[id]));

            res.send(req.body);
        } else {
            throwAnErrorToUI(res, 500);
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    /////////////// Execution Log Management  //////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     *
     * e.g. sd/v1.0/log?offset=0&limit=50sortAttr=name&sortDir=asc&filters={}
     *
     * To suit client SDK paginated layout, would want our
     * server to sent response, like
     *   {
     *            total: 9000
     *            items: []
     *    }
     *
     * GET : List batched grid information for Execution Log table
     *
     */
    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/log", function (req, res) {

//        res.set('Content-Type', 'application/json');

        var DESIRED_NUMBER_OF_RECORDS = 201;  // TODO change at will

        if (typeof this.currentLogsScaledItems == 'undefined') {
            this.currentLogsScaledItems = scaleItems(executionLogData, DESIRED_NUMBER_OF_RECORDS, ["Completed", "Filtered", "Failed", "Error"]);
            addRawMessage(this.currentLogsScaledItems);
        }
        var mapValues = getObjectValues(this.currentLogsScaledItems);
        return sendPaginatedData(req, res, mapValues);
    });

    /**
     * Required paginated grid layout call 2 (for paginated grid)
     */
    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/log-ids", function (req, res) {

        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will


        if (!failTheCall) {
            res.send(getAllIds(this.currentLogsScaledItems));
        } else {
            throwAnErrorToUI(res, 500);
        }
    });

    app.get(DO_SERVICE_PREFIX_ROOT_VERSION + "/log" + '/:log_Id', function (req, res) {

        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will

        var logId = req.params.log_Id;

        if (!failTheCall) {
            if (this.currentLogsScaledItems[logId]) {
                var data = this.currentLogsScaledItems[logId];
                var logDetails = JSON.parse(JSON.stringify(executionLogDetailsData));

                data.rawMessageInput = logDetails.rawMessageInput;

                if ((data.status === "Completed") && (data.action.toLowerCase() !== "log only")) {
                    data.rawMessageOutput = logDetails.rawMessageOutput;
                } else if (data.status === "Failed") {
                    data.notes = logDetails.notes;
                } else if (data.status === "Error") {
                    data.notes = logDetails.notes;
                } else if (data.status === "Filtered") {
                    data.notes = logDetails.notes;
                }
                res.send(data);
                return;
            }
        }
        throwAnErrorToUI(res, 500);
    });

    //////////////  Util functions for fake server  /////////////////////////////////////////////

    function patchList(req, res, scaledItems) {
        res.set('Content-Type', 'application/json');
        var failTheCall = false;  // change at will

        if (failTheCall) { // console.log("----- id = " + id); TODO -> partial failure
            throwAnErrorToUI(res, 500);
        } else {
            for (var i in req.body) {
                var item = req.body[i];
                var id = item.id;
                for (attr in item) {
                    scaledItems[id][attr] = item[attr]
                }
            }
            res.send(JSON.stringify("Request Accepted"));
        }
    }

    function getObjectValues(objMap) {
        // Object.values does not seem to exist in this version of Node.js

        var values = Object.keys(objMap).map(function (e) {
            return objMap[e]
        });
        return values;
    }

    function compareArgs(compareA, compareB) {
        if (compareA < compareB)
            return -1;
        if (compareA > compareB)
            return 1;
        return 0;
    }

    function sendPaginatedData(req, res, scaledItems) {
        res.set('Content-Type', 'application/json');

        var failTheCall = false;  // change at will

        var potentiallyFilteredAndSorted;

        if (req.query.filters && req.query.sortAttr) {   // Can make call with no parameters for fetching items for selection list
            var filteredItems = applyFilters(scaledItems, req.query.filters);
            potentiallyFilteredAndSorted = applySort(filteredItems, req.query.sortAttr, req.query.sortDir);
        } else {
            potentiallyFilteredAndSorted = scaledItems;
        }

        var totalItemsLength = potentiallyFilteredAndSorted.length;

        var offset = (req.query.offset) ? parseInt(req.query.offset) : 0;
        var limit = (req.query.limit) ? parseInt(req.query.limit) : totalItemsLength;
        var max = ((offset + limit) > totalItemsLength) ? totalItemsLength : (offset + limit);

        var batchedItems = potentiallyFilteredAndSorted.slice(offset, max);
        console.log("!!!! Paginated grid call : req.offset: " + offset + " req.limit: " + limit + " returning batch from " + offset + " to " + max);

        // TESTING empty to full grid
        //failTheCall =  (offset > 150);  // page 8 if 5000
        //failTheCall =  (offset == 0);  // first call

        var response;
        if (!failTheCall) {

            response = {
                items: batchedItems,    // noting SDK will want "items"  (an empty array back will not be liked)
                total: potentiallyFilteredAndSorted.length
            }

            res.send(JSON.stringify(response));
        } else {
            throwAnErrorToUI(res, 500);
        }
    }

    function applySort(items, sortAttr, sortDir) {
        console.log("Applying sorting on column " + sortAttr + ", direction " + sortDir);

        // assume strings
        function ascComparator(item1, item2) {

            if (item1 [sortAttr] != null && item2[sortAttr] != null) {
                return item1 [sortAttr].toString().localeCompare(item2[sortAttr].toString());
            }
            return (item2[sortAttr] == null ? 0 : 1);
        }

        function descendingComparator(item1, item2) {
            if (item1 [sortAttr] != null && item2[sortAttr] != null) {
                return item2 [sortAttr].toString().localeCompare(item1[sortAttr].toString());
            }
            return (item1[sortAttr] == null ? 0 : -1);

        }

        if (sortDir === 'asc') {
            this.items = items.sort(ascComparator);
        } else {
            this.items = items.sort(descendingComparator);
        }
        return this.items;
    }

    function applyFilters(items, filterPassedToServer) {

        var filters = JSON.parse(filterPassedToServer); // convert URL parameter String to real JSON
        var filterKeys = Object.keys(filters);

        if (filterKeys.length === 0 && filters.constructor === Object) {
            console.log("Not applying filter : " + filterPassedToServer);
            return items;  // no filters
        }
        console.log("Applying filter : " + filterPassedToServer);

        var filteredResult = items.filter(function (item) {

            for (var i = 0; i < filterKeys.length; i++) {
                var columnItemText = item[filterKeys[i]] != null ? item[filterKeys[i]] : "";
                if (columnItemText.indexOf(filters[filterKeys[i]]) === -1) {
                    return false;
                }

            }
            return true;  // must satisfy ALL in filter
        });

        return filteredResult;
    }

    /**
     * Scale Items into a Id - item Map
     * @param baseJSON
     * @param desiredRecordCount
     * @returns {{}}
     */
    function scaleItems(baseJSON, desiredRecordCount, statusValues) {

        var itemMap = {};

        if (desiredRecordCount > 0) {
            var item;

            var startIndex = 0;
            for (startIndex in baseJSON) {
                item = JSON.parse(JSON.stringify(baseJSON[startIndex]));
                item.id = startIndex++;
                itemMap[item.id] = item;
            }

            var baseItem = JSON.parse(JSON.stringify(baseJSON[0]))
            var baseId = baseItem.id;
            var dateAttrs = getDateAttrs(baseItem);

            for (var i = startIndex+1; i < desiredRecordCount; i++) {
                item = JSON.parse(JSON.stringify(baseJSON[0]));
                item.id = i;

                if (item.userId != undefined) {
                    item.userId = i.toString();
                }
                if (item.engineId != undefined) {
                    item.engineId = i.toString();
                }
                if (dateAttrs) {
                    for (var dateIx in dateAttrs) {
                        var dateAttr = dateAttrs[dateIx];
                        item[dateAttr] = getRandomDate();                       
                    }
                }
                
                itemMap [item.id] = item;
                if (statusValues && item.status) {
                    var statusIndex = Math.floor((Math.random() * statusValues.length));
                    item.status = statusValues[statusIndex]; 
                }
            }
        }
        return itemMap;
    }

    function addRawMessage(items) {
        for (i in items) {
            var item = items[i];
            if (item.status === "Completed") {
                item.rawMessage = "Input/Output";
            } else {
                item.rawMessage = "Input/Notes";
            }
        }
    }

    function getDateAttrs(baseItem) {
        var dateAttrs = [];
        for (attr in baseItem) {
            if (isDateAttr(attr)) {
                dateAttrs.push(attr);
            }
        }
        return dateAttrs;
    }
    
    function isDateAttr(attrName) {
        return ((String(attrName).indexOf("Date")) >= 0);
    }
    
    function getRandomDate() {
        var day = getRandomValue(29);
        var month = getRandomValue(11);
        var hour = getRandomValue(24);
        var min =  getRandomValue(60);
        var sec =  getRandomValue(60);
        return "2017-"+month+"-"+day + " " + hour + ":" + min + ":" + sec;
    }
    
    function getRandomValue(max) {
        var val = Math.round(Math.random() * max) + 1;
        return (val < 10) ? "0" + val : val;
    }

    function getAllIds(scaledItems) {
        var ids = Object.keys(scaledItems);
        return JSON.stringify({"ids" : ids});
    }

    function getItem(scaledItems, id) {
        var ids = Object.keys(scaledItems);
        return JSON.stringify(ids);
    }

    function throwAnErrorToUI(response, statusCode, internalErrorCode) {
        var exception = {
            "userMessage": "could use this to check for key but will use internalErrorCode (when present) instead",
            "httpStatusCode": statusCode,
            "internalErrorCode": internalErrorCode,  // If not in dictionary - will present generic message UX people want
            "developerMessage": "Some info for developer",
            "time": " ",
            "links": [],
            "errorData": "[userName1, userName2]"
        };
        response.status(statusCode).send(JSON.stringify(exception));
    }
};
