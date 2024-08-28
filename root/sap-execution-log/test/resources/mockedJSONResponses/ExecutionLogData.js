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
if (typeof define !== 'function') {
    var define = require('../../../../node_modules/amdefine')(module);
}

define(function () {

    /**
     * simulated response from /sd/v1.0/logs
     * (will scale this up to test pagination)
     */

    return [
            {
                "id": 1,
                "action": "restart",
                "assetName": "vm1",
                "assetType": "vm",
                "creationDate": "2018-07-04 14:34:59",
                "engineId": "1",
                "eventType": "pm",
                "instanceId": "1",
                "status": "Completed",
                "rawMessage": "Input/Output",
            },
            {
                "id": 1,
                "action": "restart",
                "assetName": "vm2",
                "assetType": "host",
                "creationDate": "2018-07-04 14:34:59",
                "engineId": "1",
                "eventType": "comm",
                "instanceId": "1",
                "status": "Filtered",
                "rawMessage": "Input/Notes",
             } 
    ]
});
