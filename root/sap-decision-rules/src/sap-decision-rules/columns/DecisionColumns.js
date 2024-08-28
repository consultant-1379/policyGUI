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
define([
    'i18n!eso-commonlib/dictionary.json',
    './DecisionColumnAttributes',
    'eso-commonlib/StatusCell'
],
    function (Dictionary, DecisionColumnAttributes, StatusCell) {
        'use strict';
        return {
            columns: [

                /* as used with table settings, columns can not be removed and reordered,
                 * so can not really assign an auto-fit column (no width) so well
                 * (Tried and column disappeared on grid re-create when had all columns)
                 */
                {
                    title: Dictionary.columnTitles.EVENT_TYPE,
                    attribute: DecisionColumnAttributes.EVENT_TYPE,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ASSET_TYPE,
                    attribute: DecisionColumnAttributes.ASSET_TYPE,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.STATUS,
                    attribute: DecisionColumnAttributes.STATUS,
                    width: '100px',
                    cellType: StatusCell,
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.TENANT_NAME,
                    attribute: DecisionColumnAttributes.TENANT_NAME,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.METER_NAME,
                    attribute: DecisionColumnAttributes.METER_NAME,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.SEVERITY_EVALUATION,
                    attribute: DecisionColumnAttributes.SEVERITY_EVALUATION,
                    width: '40px',
                    sortable: false,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.SEVERITY,
                    attribute: DecisionColumnAttributes.SEVERITY,
                    width: '110px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ACTION,
                    attribute: DecisionColumnAttributes.ACTION,
                    width: '110px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ACTION_COUNTER_GREATER_THAN,
                    attribute: DecisionColumnAttributes.ACTION_COUNTER_GREATER_THAN,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.TIME_LAPSE,
                    attribute: DecisionColumnAttributes.TIME_LAPSE,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ALTERNATIVE_ACTION,
                    attribute: DecisionColumnAttributes.ALTERNATIVE_ACTION,
                    width: '160px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.CREATION_DATE,
                    attribute: DecisionColumnAttributes.CREATION_DATE,
                    width: '160px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.LAST_UPDATE_DATE,
                    attribute: DecisionColumnAttributes.LAST_UPDATE_DATE,
                    width: '160px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.CREATED_BY,
                    attribute: DecisionColumnAttributes.CREATED_BY,
                    width: '120px',
                    sortable: true,
                    resizable: true
                }
                ]
        };
    });


