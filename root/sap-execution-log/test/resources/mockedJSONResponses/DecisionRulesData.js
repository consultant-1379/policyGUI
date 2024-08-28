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
     * simulated response from /sd/v1.0/policy
     * (will scale this up to test pagination)
     */

    return [
        {
            "id": 1,
            "action": "recreate",
            "alternativeAction": "",
            "assetType": "vm",
            "createdBy": "root",
            "creationDate": "2018-06-20 15:18:24",
            "eventType": "pm",
            "lastUpdateDate": "2018-06-20 15:18:24",
            "lastUpdatedBy": "root",
            "meterName": "cpu_util",
            "severity": "minor",
            "severityEvaluation": ">=",
            "status": "Active",
            "tenantName": null,
        },
        {
            "id": 2,
            "action": "restart",
            "actionCount": 5,
            "alternativeAction": "recreate",
            "assetType": "vm",
            "createdBy": "root",
            "creationDate": "2018-06-20 15:18:24",
            "eventType": "pm",
            "lastUpdateDate": "2018-06-20 15:18:24",
            "lastUpdatedBy": "root",
            "meterName": "cpu_*",
            "severity": "major",
            "severityEvaluation": "<",
            "status": "Inactive",
            "tenantName": "fred",
            "timeLapse": 1
        },
        {
            "id": 3,
            "action": "restart",
            "actionCount": 5,
            "alternativeAction": null,
            "assetType": "host",
            "createdBy": "root",
            "creationDate": "2018-06-20 15:18:24",
            "eventType": "comm",
            "lastUpdateDate": "2018-06-20 15:18:24",
            "lastUpdatedBy": "root",
            "meterName": "cpu_*",
            "severity": "critical",
            "severityEvaluation": "=",
            "status": "Active",
            "tenantName": "AIB",
            "timeLapse": 1
        }
    ]
});
