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
 * Date: 11/05/18
 */
define([
    'jscore/core',
    'eso-commonlib/AjaxService'
], function (core, ajaxService) {
    'use strict';

    /**
     * This class handling is replacing client SDK refresh method
     * to suit Polling
     *
     * Particularly it is here to stop the screen flickering when updating
     * with new content (on every poll),
     * by pre-fetching data ahead of displaying the new data.
     *
     * Preserving original selection (also for pol)
     * will be added for all refresh but
     * as part of the GeneralPaginatedLayoutTable
     * @see GeneralPaginatedLayoutTable
     */

    return core.AppContext.extend({


        hasData: false,

        /**
         * Construct
         * @param options
         *          getPaginatedTable : fetch current GeneralPaginatedLayoutTable
         *
         */
        init: function (options) {
            this.options = options ? options : {};

            this.getPaginatedTable = this.options.getPaginatedTable;
            this.onErrorHandler = this.options.onErrorHandler;


        },

        /**
         * Make two parallel server calls required for paginated table
         * @param getItemsURL      Fetch data URL required by SDK for paginated grids
         * @param getAllIdsURL     Get all IDs URL required by SDK for paginated grids
         * @param urlQueryParams   Any extra parameters for rows call
         */
        silentRefresh: function (getItemsURL, getAllIdsURL, urlQueryParams) {

            var queryParams = "";
            if (urlQueryParams) {
                for (var key in urlQueryParams) {
                    if (urlQueryParams.hasOwnProperty(key)){
                    queryParams += "&" + key + "=" + urlQueryParams[key];
                    }
                }
            }
            var url = getItemsURL + queryParams;

            var requests = [
                {url: url},
                {url: getAllIdsURL}
            ];

            var commonOptions = {
                error: this.handleParallelError.bind(this)
            };


            ajaxService.getCallParallel(commonOptions, requests, this.handleParallelSuccess.bind(this));

        },

        /**
         * Cache last request data
         * (to be picked up when refresh with false parameter)
         *
         * @param parallelResponse  array of responses for the 2 calls (order not guaranteed)
         */
        handleParallelSuccess: function (parallelResponse) {
            this.hasData = parallelResponse && parallelResponse.length === 2;

            if (parallelResponse [0].items) {
                this.rowData = parallelResponse [0];
                this.allIds = parallelResponse [1];

            } else {
                this.rowData = parallelResponse [1];
                this.allIds = parallelResponse [0];
            }

            /* implement the regular refresh call */
            var paginatedTable = this.getPaginatedTable();
            if (paginatedTable) {
                paginatedTable.refresh(false);
            }
        },

        hasReadyData: function () {
            return this.hasData;
        },

        getAllIds: function () {
            return this.allIds;
        },

        getRowData: function () {
            return this.rowData;
        },

        handleParallelError: function (model, response) {
            this.hasData = false;
            this.onErrorHandler(model, response);
        }

    });
});

