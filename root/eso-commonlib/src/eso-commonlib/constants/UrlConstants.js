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
 */
define({

        /**
         * This class is to hold reference to ALL  REST calls uses by this UI
         *
         */
        RE_DIRECT_LOG_IN_PAGE_URL: "#sap-execution-log",

        decision: {

            /**
             *
             * Decision NBI service used both to
             *
             * 1) Display paginated grid of policies:
             *
             *      e.g. GET /sd/v1.0/decision?offset=0&limit=50sortAttr=name&sortDir=asc&filters={{name: 'Hell"}}
             *
             *      To suit client SDK paginated layout, would want our server to send response, like
             *          {
             *              total: 9000    (note a number : same as total id count - unless filter the data)
             *              items: [{rowData, rowData}]
             *          }
             *      where row Data must contain an "id" attribute in each row, e.g.
             *
             *         {
             *              "id": "a1",
             *              "eventType": "PM",
             *              "assetType": "VM",
             *              "status": "Active",
             *              "tenantName": "ATT*",
             *              "meterName": "cpu_util",
             *              "severityEvaluation": ">",
             *              "severity": "major",
             *              "action": "Restart VM",
             *              "actionCounterGreaterThan": "3",
             *              "timeLapse": "10",
             *              "alternativeAction": "Create VM",
             *              "lastUpdateDate": "2017-04-21 18:25:43 05:00",
             *              "userId": "xyz",
             *          }
             *
             *
             * 2) Used to populate the SelectBox used to during Create.
             *
             * e.g. GET /sd/v1.0/decision       (no offsets, etc. supplied and UI will
             *
             *
             * GET :    As above
             * DELETE : Pass array of Ids in body of delete call, e.g. (["id1","id2"]:
             *
             */
            DECISION_GRID_DATA: "/policynbi/sd/v1.0/decision",

            /**
             * GET : List of all IDs to support policies as a paginated table
             *
             * To suit client SDK paginated layout, would want our
             * server to sent array response, like
             * ["id1, "id2", "id3", ....]
             */
            DECISIONS_ALL_IDS: "/policynbi/sd/v1.0/decision-ids",
        },

        log: {

            /**
             *
             * Logs NBI service used both to
             *
             * 1) Display paginated grid of logs:
             *
             *      e.g. GET /sd/v1.0/logs?offset=0&limit=50sortAttr=name&sortDir=asc&filters={{name: 'Hell"}}
             *
             *      To suit client SDK paginated layout, would want our server to send response, like
             *          {
             *              total: 9000    (note a number : same as total id count - unless filter the data)
             *              items: [{rowData, rowData}]
             *          }
             *      where row Data must contain an "id" attribute in each row, e.g.
             *
             *         {
             *             "id": "a1",
             *             "creationDate": "2017-04-21 18:25:43 05:00",
             *             "status": "Active",
             *             "eventType": "PM",
             *             "assetType": "VM",
             *             "action": "restart VM",
             *             "instanceId": "123",
             *             "engineId": "456",
             *          }
             *
             */
            LOGS_GRID_DATA: "/policynbi/sd/v1.0/log",

            /**
             * GET: Returns the execution log details for the given id
             */
            LOGS_GRID_DETAILS_DATA: "/policynbi/sd/v1.0/log/{0}",

            /**
             * GET : List of all IDs to support log as a paginated table
             *
             * To suit client SDK paginated layout, would want our
             * server to sent array response, like
             * ["id1, "id2", "id3", ....]
             */
            LOGS_ALL_IDS: "/policynbi/sd/v1.0/log-ids",
        }
    }
);
