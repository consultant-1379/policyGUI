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
    'jscore/core',
    'uit!./ExecutionLogRegion.html',
    '../../Dictionary',

    './ExecutionLogContextActions',

    '../../filter-forms/logs/FilterForm',
    '../../columns/ExecutionLogColumns',

    'eso-commonlib/DialogUtils',
    'eso-commonlib/GeneralPaginatedLayoutTable',
    'eso-commonlib/RefreshWidget',
    'eso-commonlib/LastRefreshedLabel',
    'eso-commonlib/UrlConstants',
    'eso-commonlib/Utils',
    
    'container/api'

], function (core, View, Dictionary, ExecutionLogContextActions, FilterForm, ExecutionLogColumns, DialogUtils, GeneralPaginatedLayoutTable, RefreshWidget, LastRefreshedLabel, UrlConstants, Utils, container) {
    'use strict';

    /**
     * Class to show Execution Logs using Paginated Grid Layout.
     *
     * Contains refresh option on right.
     */
    return core.Region.extend({

        view: function () {

            return new View({
                "NO_LOGS_TO_DISPLAY_GRID_MESSAGE": Dictionary.inline.NO_LOGS_TO_DISPLAY_GRID_HEADER,
            });
        },

        /**
         * Initialise
         * @param options
         */
        init: function (options) {
            this.options = (options) ? options : {};
            this.refreshWidget = new RefreshWidget();
            this.refreshWidget.resetItemToRefresh(this);   //  #handleRefresh method present

            this.logContextActions = new ExecutionLogContextActions({
                getSelectedRows: this.getSelectedRows.bind(this),
                getSelectedIds: this.getSelectedIds.bind(this),
                handleRefresh: this.handleRefresh.bind(this),
                eventBus: this.getEventBus()
            });
        },

        /**
         * Called when enter app (once)
         */
        onStart: function () {
            this.handleRefresh();
            this.getEventBus().publish('topsection:left', this.refreshWidget);

        },

        onStop: function () {
            this.destroyTable();
            if (this.refreshWidget) {
                this.refreshWidget.handleHouseKeepingOnClose();
            }
            this.getEventBus().publish('topsection:left', undefined);
        },

        /**
         * Note this is called from the Application class
         * when defining the TopSection, i.e. to return the
         *
         * @returns {Array}  TopSection actions available when no row is selected
         */
        getDefaultActions: function () {
            return [];
        },

        createTable: function () {
            this.table = this.createPaginatedTable();
            this.table.attachTo(this.getGridHolder());
            this.table.getPaginatedTable().addEventHandler('select:change', this.logContextActions.viewDetails.bind(this.logContextActions));
        },

        destroyTable: function () {
            if (this.table) {
                this.table.detach();
                this.table.destroy();
                delete this.table;
            }
        },

        /**
         * Refresh Table Data
         * Note name #handleRefresh intended to suit use by RefreshWidget
         *
         * @param toastMessage  (optional) Toast message to show as part of refresh
         *                      (e.g. following a successful delete or install)
         */
        handleRefresh: function (toastMessage) {

            this.attachLastRefreshedWidget();

            if (this.table) {
                this.table.refresh();  // SDK method intended to be called when data has changed
            } else {
                this.createTable();
            }

            if (toastMessage) {
                this.showToastMessage(toastMessage);
            }
        },

        createPaginatedTable: function () {
            var paginatedLayoutOptions = {
                showCheckBoxes: false,
                columns: ExecutionLogColumns.columns,
                filterFormClass: FilterForm,
                header: Dictionary.titles.LOG_TABLE_HEADER,
                url: UrlConstants.log.LOGS_GRID_DATA,
                getAllIdsURL: UrlConstants.log.LOGS_ALL_IDS,
                paginatedLayoutRowSelectionHandler: this.paginatedLayoutRowSelectionHandler.bind(this),
                showEmptyGridMessage: this.showEmptyGridMessage.bind(this),
                onErrorHandler: this.onFetchError.bind(this),
                getCurrentContextActions: this.getCurrentContextActions.bind(this),
                overRiddenSortColumn: "creationDate",
                showFilteringOptions: true,
                showSortingOptions: true
            };

            return new GeneralPaginatedLayoutTable(paginatedLayoutOptions);
        },

        onFetchError: function (model, response) {
            if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)

                var forbiddenMsg = Dictionary.forbiddenActionMessages.VIEW_LOGS;

                DialogUtils.showForbiddenDialog(forbiddenMsg);
                this.showInlineMessage(DialogUtils.createForbiddenInlineMessage(forbiddenMsg));

            } else {
                this.showInlineMessage(DialogUtils.createErrorInlineMessage(response));
            }

            this.attachLastRefreshedWidget();   // can use refresh widget to try again
        },

        /**
         * Attach InlineMessage object
         * after removing all other elements on DOM and top section context buttons
         * @param inlineMessage  constructed InlineMessage
         */
        showInlineMessage: function (inlineMessage) {

            this.removeDisplayedContent();
            inlineMessage.attachTo(this.getInlineMessageHolder());
            Utils.showElementInlineBlock(this.getInlineMessageHolder(), true);
        },

        hideInlineMessage : function(){
            // Note :  do not remove the asset version (empty message)
            Utils.removeAllChildrenFromElement(this.getInlineMessageHolder());
        },


        /**
         * Replace default empty message SDK use for paginated layout.
         * (not called when filter is on)
         * @param isShow   true to show message
         */
        showEmptyGridMessage: function (isShow) {

            if (isShow) {
                this.removeDisplayedContent();
            }

            Utils.showElementInlineBlock(this.getNoTemplatesMessageHolder(), isShow);
        },

        removeDisplayedContent: function () {
            this.destroyTable();
            this.hideInlineMessage();
            this.getEventBus().publish("topsection:leavecontext");
        },

        showToastMessage: function (toastMsg) {

            var notificationWidget = DialogUtils.createSuccessToastNotification(toastMsg);
            notificationWidget.attachTo(this.getElement());

        },

        attachLastRefreshedWidget: function () {

            this.deleteLastRefreshedLabel();
            this.lastRefreshedLabel = new LastRefreshedLabel();
            this.lastRefreshedLabel.attachTo(this.getLastRefreshedWidgetHolder());

        },

        deleteLastRefreshedLabel: function () {
            if (this.lastRefreshedLabel) {
                this.lastRefreshedLabel.handleHouseKeepingOnClose();
                delete this.lastRefreshedLabel;
            }
        },

        /* should really only be called following row selection */
        getSelectedRows: function () {

            if (this.table) {
                return this.table.getSelectedRows();
            }
            return [];

        },

        /* assumes SDK method will return ids (rather than us reading the "id" on the selected rows*/
        getSelectedIds: function () {
            if (this.table) {
                return this.table.getSelectedIds();
            }
            return [];
        },


        ///////////////    Paginated Table Support  ///////////////

        paginatedLayoutRowSelectionHandler: function () {

            return {
                /**
                 * Success population of grid (page)
                 *
                 * @currentPageRowCount   current page
                 */
                handleGridPopulation: function (currentPageRowCount) {
                    this.hideInlineMessage();    // hide previous error messages if any
                }.bind(this),

                /* select all on all pages - nothing extra required - for as long no special handling required for select all use case */
                selectAllOnAllPages: function () {
                }
            };
        },

        setCurrentContextActions: function (contextActions) {
            this.contextActions = contextActions;
        },

        getCurrentContextActions: function () {
            return this.contextActions;
        },

        /* DOM interactions */

        getLastRefreshedWidgetHolder: function () {
            return this.findElementByClassName("-lastRefreshedHolder");
        },

        getGridHolder: function () {
            return this.findElementByClassName("-gridHolder");
        },

        getInlineMessageHolder: function () {
            return this.findElementByClassName("-inlineMessageHolder");
        },

        getNoTemplatesMessageHolder: function () {
            return this.findElementByClassName("-noTemplatesMessageHolder");
        },

        /**
         * Adding prefix present on all divs in the widget's html
         * @param suffix   - end of the name
         * @returns {*}
         */
        findElementByClassName: function (suffix) {
            return this.getElement().find(".eaSapExecutionLog-rList" + suffix);
        }
    });
});