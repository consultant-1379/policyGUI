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
    './ExecutionLogColumnAttributes',
    'eso-commonlib/StatusCell',
    'eso-commonlib/RawMessageCell'
],
    function (Dictionary, ExecutionLogColumnAttributes, StatusCell, RawMessageCell) {
        'use strict';
        return {
            columns: [

                /* as used with table settings, columns can not be removed and reordered,
                 * so can not really assign an auto-fit column (no width) so well
                 * (Tried and column disappeared on grid re-create when had all columns)
                 */
                {
                    title: Dictionary.columnTitles.CREATION_DATE,
                    attribute: ExecutionLogColumnAttributes.CREATION_DATE,
                    width: '200px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.STATUS,
                    attribute: ExecutionLogColumnAttributes.STATUS,
                    cellType: StatusCell,
                    width: '150px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.EVENT_TYPE,
                    attribute: ExecutionLogColumnAttributes.EVENT_TYPE,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ASSET_TYPE,
                    attribute: ExecutionLogColumnAttributes.ASSET_TYPE,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ASSET_NAME,
                    attribute: ExecutionLogColumnAttributes.ASSET_NAME,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ACTION,
                    attribute: ExecutionLogColumnAttributes.ACTION,
                    width: '140px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.RAW_MESSAGE,
                    attribute: ExecutionLogColumnAttributes.STATUS,
                    cellType: RawMessageCell,
                    width: '140px',
                    sortable: false,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.INSTANCE_ID,
                    attribute: ExecutionLogColumnAttributes.INSTANCE_ID,
                    width: '120px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.columnTitles.ENGINE_ID,
                    attribute: ExecutionLogColumnAttributes.ENGINE_ID,
                    width: '200px',
                    sortable: true,
                    resizable: true
                }
                ]
        };
    });


