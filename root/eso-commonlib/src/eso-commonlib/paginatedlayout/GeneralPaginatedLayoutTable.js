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
 * Date: 05/01/18
 */

define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    './BackgroundTableRefresher',
    'eso-commonlib/TableSettingsUpdater',

    'container/api',
    'widgets/Loader',

    'eso-commonlib/AjaxService',
    'eso-commonlib/UrlConstants',
    'eso-commonlib/Constants',
    'eso-commonlib/Utils',

    'tablelib/layouts/PaginatedTable',
    'tablelib/TableSettings',

    'tablelib/plugins/ColorBand',
    'tablelib/plugins/ExpandableRows',
    'tablelib/plugins/Selection',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/StickyScrollbar',
    'tablelib/plugins/RowEvents',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/FixedHeader'

], function (core, Dictionary, BackgroundTableRefresher, TableSettingsUpdater, container,
        Loader, ajaxService, UrlConstants, Constants, Utils, PaginatedTable, TableSettings,
        ColorBand, ExpandableRows, Selection, ResizableHeader, SmartTooltips, StickyHeader, StickyScrollbar, RowEvents, SortableHeader, FixedHeader) {

    /**
     * Class using SDK PaginatedTable to display server side paginated grid with sorting and filtering
     * (can be turned off)
     *
     * The list of selected ids is available from getSelectedIds.
     *
     */
    var GeneralPaginatedLayoutTable = core.Widget.extend({

        /**
         * SDK keeps selected Ids, but caching selected Rows in case we
         * need selected rows - as we get information from row cells
         */
        selectedRows: {},

        /**
         * To save "over publishing" to top section nav bar,
         * caching number of previous rows selected such that if
         * no condition changes that would affect top section buttons present,
         * no publish would be required
         */
        cachedNumPrevSelectedRows: 0,


        /**
         * Construct params
         * e.g
         * [===
         * var paginatedLayoutOptions = {
         *      columns: e.g. ServiceTemplateColumns.columns,
         *      filterFormClass :  Widget for FilterForm, e.g. ServiceTemplateFilterForm
         *      header: Dictionary.titles.SERVICE_TEMPLATE_TABLE_HEADER
         *      url: initial REST URI to service,
         *      urlQueryParams: e.g. {'networkTechnology': Constants.serverConstants.LTE},
         *      getAllIdsURL: REST URI to get all Ids
         *      expandableContent: expandableRowsContent,   [optional] if table has expandableRows
         *      paginatedLayoutRowSelectionHandler: this.paginatedLayoutRowSelectionHandler.bind(this),
         *        implementing :
         *            #selectAllOnAllPages
         *            #selectChange(selectedRowCount, this.cachedNumPrevSelectedRows)
         *            #handleGridPopulation   - initial grid population
         *
         *      showEmptyGridMessage: this.showEmptyGridMessage.bind(this),    (optional)
         *      onErrorHandler: this.onConflictsFetchError.bind(this),
         *      getCurrentContextActions: this.getCurrentContextActions.bind(this)
         *      fixedHeight : (if required) e.g. "350"
         *      showCheckBoxes : set if show checkboxes (default true)
         *
         *      showFilteringOptions : false,
         *      showSortingOptions : false
         *      overRiddenSortColumn : "name"
         * };
         *
         *  this.table = new GeneralPaginatedLayoutTable(paginatedLayoutOptions);
         *  this.table.attachTo(this.view.getCTableWidgetHolder());
         *  ===]
         *
         * @param options
         */
        init: function (options) {

            this.initOptions(options);
            this.DEFAULT_SORT_DIR = 'desc';

            if(this.columns && this.columns.length > 0){
                this.DEFAULT_SORT_COLUMN = this.columns[0].attribute;
                this.columns[0].disableVisible = true; // Table Setting DR (not to allow no column selected)

            }
            this.backgroundTableRefresher = new BackgroundTableRefresher({
                getPaginatedTable: this.getPaginatedTable.bind(this),
                onErrorHandler: this.onErrorHandler.bind(this)
            });

        },

        onViewReady: function () {

            this.clearSelectedRowsCache();
            this.paginatedTable = this.createPaginatedLayoutTable();
            this.paginatedTable.attachTo(this.getElement());

            if (this.showCheckBoxes) {
                this.setupObserver();
            }

            this.showFilterOption(this.showFilteringOptions);
            this.showTableSettingsOption(this.showTableSettingOption);

            TableSettingsUpdater.addHandlers(this.paginatedTable, this.options.header.toLowerCase());
        },

        onDestroy: function () {

            this.clearSelectedRowsCache();

            if (this.paginatedTable) {
                this.removeEventHandlers();
                this.removeTableContextMenuEventHandler();
                this.paginatedTable.destroy();
                delete this.paginatedTable;
            }
        },

        /* constructor method - exposed for unit test */
        initOptions: function (options) {

            this.options = (options) ? options : {};

            this.columns = this.options.columns;
            this.header = this.options.header;

            this.url = this.options.url;
            this.urlQueryParams = this.options.urlQueryParams;
            this.getAllIdsURL = this.options.getAllIdsURL;

            this.expandableContent = this.options.expandableContent;
            this.colorBandPluginFunction = this.options.colorBandPluginFunction;

            this.onErrorHandler = this.options.onErrorHandler;
            this.paginatedLayoutRowSelectionHandlerFunction = this.options.paginatedLayoutRowSelectionHandler;
            this.showEmptyGridMessage = this.options.showEmptyGridMessage;  // replace client SDK empty handling with our handling
            this.getCurrentContextActions = this.options.getCurrentContextActions;
            this.fixedHeight = this.options.fixedHeight;
            this.FilterForm = this.options.filterFormClass;
            this.overRiddenSortColumn = this.options.overRiddenSortColumn;

            // some config options -  default true (until server ready for example)
            this.showCheckBoxes = Utils.isDefined(this.options.showCheckBoxes) ? this.options.showCheckBoxes : true;
            this.showSortingOptions = Utils.isDefined(this.options.showSortingOptions) ? this.options.showSortingOptions : true;
            this.showFilteringOptions = Utils.isDefined(this.options.showFilteringOptions) ? this.options.showFilteringOptions : true;
            this.showTableSettingOption = Utils.isDefined(this.options.showTableSettingOption) ? this.options.showTableSettingOption : true;
            this.isMultiSelect = Utils.isDefined(this.options.isMultiSelect) ? this.options.isMultiSelect : true;
        },

        /**
         * Create Paginated Table
         *
         * Need to define a getTableSettingsForms method because the default that would be displayed if did not provide this method
         * would contain pins (showPins true), which do not work with an expandable row table
         *
         * @returns {tablelib.layouts.PaginatedTable}
         */
        createPaginatedLayoutTable: function () {
            var savedConfig = TableSettingsUpdater.getSavedConfig(this.options.header.toLowerCase());
            var columns = (savedConfig) ? savedConfig.columns : this.columns;
            var config = this.getTableConfig(savedConfig);

            var paginatedLayoutOptions = {
                columns: columns,
                config: config,
                header: this.header,
                fetch: this.fetchPaginatedData.bind(this),
                getAllIds: this.getAllIds.bind(this),
                getTableFilterForm: getTableFilterForm.bind(this),
                getPlugins: getPlugins.bind(this)

            };
            return new PaginatedTable(paginatedLayoutOptions);
        },

        getTableConfig: function (savedConfig) {
            if (savedConfig) {
                return savedConfig.config;
            } else if (this.overRiddenSortColumn) {
                return {"limit":50,"offset":0,"pageIndex":1,"sortAttr":this.overRiddenSortColumn,"sortDir":this.DEFAULT_SORT_DIR};
            } else {
                return undefined;
            }
        },

        /**
         * After calls come back success for population of grid (e.g. on refresh),
         * there is a delay before the table is populated. The framework is loosing
         * previous selection (i.e. not good if refresh is on a poll).
         * This is observer is listening for the actual population of the grid with data
         */
        setupObserver: function () {

            var tableBodyNode;
            var tableBody = this.paginatedTable.getElement().find(Constants.clientSDKClassNames.TABLE_LIB_TABLE_BODY);
            if (tableBody) {
                tableBodyNode = tableBody.getNative();
            } else {
                Utils.log("GenericPaginatedLayoutTable : Unable to find div to support setting up MutationObserver: " + Constants.clientSDKClassNames.TABLE_LIB_TABLE_BODY);
            }

            if (tableBodyNode) {
                var observer = this.createMutationObserver();

                var observerConfig = {
                    attributes: true,
                    childList: true,
                    characterData: true
                };
                observer.observe(tableBodyNode, observerConfig);

            } else {
                Utils.log("GenericPaginatedLayoutTable : GeneralPaginatedLayoutTable failing to add observer for paginated table population");
            }
        },

        /* for unit test - test needs to work from command line without window*/
        createMutationObserver: function () {
            return new MutationObserver(function (mutations) {

                this.methodsToCallWhenGridToPopulated();

            }.bind(this));
        },


        methodsToCallWhenGridToPopulated: function () {
            this.removeEventHandlers();
            this.reSelectSelectedRowsAfterRefresh();
            this.addEventHandlers();
            this.addTableContextMenuEventHandlerOnce();  // we know the table is now populated
        },

        /**
         * Wrap client SDK refresh method
         * This method should be called when the data has changed.
         * It will refresh the data displayed on the current page and clear any items currently selected.
         *
         * @param isPolling : true to refresh silently (quicker disabling and loading as
         *                    caching response prior to calling SDK method)
         */
        refresh: function (isPolling) {

            // smoother if turn off listeners
            this.preRefreshSelectedIds = this.getSelectedIds();
            this.removeEventHandlers();

            if (isPolling && Utils.isDefined(typeof this.cachedUrlToSend)) {

                this.backgroundTableRefresher.silentRefresh(this.cachedUrlToSend, this.getAllIdsURL);

            } else {
                this.paginatedTable.refresh();
            }
        },

        getPaginatedTable: function () {
            return this.paginatedTable;
        },

        /**
         * Has user chosen the "Select all xxx on all pages" link
         * @returns {*}  true if all rows on all pages are selected
         */
        isSelectAllChecksOnAllPages: function () {
            return this.isSelectAllCheckActive;
        },

        addEventHandlers: function () {

            if (this.paginatedTable) {

                if (!Utils.isDefined(this.selectChangeEventHandlerId)) {
                    this.selectChangeEventHandlerId = this.paginatedTable.addEventHandler('select:change', rowSelectionChangeHandler.bind(this));
                }

                if (!Utils.isDefined(this.selectPageEventHandlerId)) {
                    this.selectPageEventHandlerId = this.paginatedTable.addEventHandler('select:page', function (pageIndex) {
                        this.isSelectAllCheckActive = false;
                    }.bind(this));
                }
                if (!Utils.isDefined(this.selectAllRowsEventHandlerId)) {
                    this.selectAllRowsEventHandlerId = this.paginatedTable.addEventHandler('select:all', selectAllRowsOnAllPagesHandler.bind(this));
                }
            } else {
                console.log("GeneralPaginatedLayoutTable: Calling add event listener on undefined table");
            }

        },

        removeEventHandlers: function () {

            if (Utils.isDefined(this.selectChangeEventHandlerId)) {
                this.paginatedTable.removeEventHandler('select:change', this.selectChangeEventHandlerId);
                delete this.selectChangeEventHandlerId;
            }
            if (Utils.isDefined(this.selectPageEventHandlerId)) {
                this.paginatedTable.removeEventHandler('select:page', this.selectPageEventHandlerId);
                delete this.selectPageEventHandlerId;
            }
            if (Utils.isDefined(this.selectAllRowsEventHandlerId)) {
                this.paginatedTable.removeEventHandler('select:all', this.selectAllRowsEventHandlerId);
                delete this.selectAllRowsEventHandlerId;
            }
            // do not include context menu here as add and remove handlers in #clearAllRowSelectionOnAllPages

        },

        removeTableContextMenuEventHandler: function () {

            if (this.contextMenusEventId) {

                var underLyingTable = this.getUnderLyingTable();
                if (underLyingTable) {
                    underLyingTable.removeEventHandler('rowevents:contextmenu', this.contextMenusEventId);
                }
            }
            delete this.contextMenusEventId;


        },

        getCheckboxPosition: function () {

            var bothPlugins = Utils.isDefined(this.expandableContent) && Utils.isDefined(this.colorBandPluginFunction);
            var onePlugin = (Utils.isDefined(this.expandableContent) &&
                    (!Utils.isDefined(this.colorBandPluginFunction)) || (!Utils.isDefined(this.expandableContent) &&
                            (Utils.isDefined(this.colorBandPluginFunction))));

            if (bothPlugins) {
                return 2;
            } else if (onePlugin) {
                return 1;
            }
            return 0;

        },

        reSelectSelectedRowsAfterRefresh: function () {

            if (this.showCheckBoxes && this.preRefreshSelectedIds && this.preRefreshSelectedIds.length > 0) {

                var checkboxPosition = this.getCheckboxPosition();

                var underlyingTable = this.getUnderLyingTable();
                var foundCount = 0;
                var rowIds = this.preRefreshSelectedIds;

                if (this.isSelectAllChecksOnAllPages()) {

                    this.selectRowsOnAllPages();

                } else {
                    if (underlyingTable) {
                        underlyingTable.selectRows(function (row) {

                            if (foundCount >= rowIds.length) {
                                return false; // all found
                            }

                            var id = row.getData().id;
                            var isRowFound = (rowIds.indexOf(id) !== -1 );
                            if (isRowFound) {
                                var checkbox = row.getCells()[checkboxPosition];   // check box with color bac
                                checkbox.check(true, false, this.createDummyEvent()); // with out trigger
                                foundCount++;
                            }
                            return isRowFound;
                        }.bind(this));
                    }
                }
            }


        },

        createDummyEvent: function () {
            /* originalEvent is for client SDK  SelectionBase.onRowCheck method (download SDK tablelib code to see)*/
            return { originalEvent: {}};
        },


        /**
         * Calls the direct client SDK method
         * @returns {*}
         */
        getSelectedIds: function () {
            if (this.paginatedTable) {
                return this.paginatedTable.getSelectedIds();
            }
            return [];

        },

        /**
         * SDK Paginated grid goes not provide any access to selected row content (only select row ids)
         *
         * @returns {*}    cached row content of selected rows  (from options.model)
         *                 e.g. can call getSelectedRows()[3].name;
         */
        getSelectedRows: function () {

            if (!Utils.isDefined(this.selectedRows)) {
                return [];
            }

            if (typeof Object.values === 'function') {    // browser compatibility
                return Object.values(this.selectedRows);

            } else {
                var longHandArray = [];
                for (var idKey in this.selectedRows) {
                    if (this.selectedRows.hasOwnProperty(idKey)) {
                        longHandArray.push(this.selectedRows[idKey]);
                    }
                }
                return longHandArray;
            }
        },

        clearSelectedRowsCache: function () {
            this.selectedRows = {};
        },

        /**
         * The client SDK paginatedTable layout does not have a selected rows method (it has #getSelectedIds).
         * We will only be able to build this up using current table (page) table.
         * So building it up on row selection (can only select on current (page) table.
         *
         * Note can only save row information for pages the user has visited.
         */
        updateSelectedRowsCache: function () {

            var selectedRowsIdsAllPages = this.paginatedTable.getSelectedIds(); // probably strings

            // remove previously selected rows if no longer in full Selected row id list
            for (var idKey in this.selectedRows) {
                if (this.selectedRows.hasOwnProperty(idKey)) {   // id becomes String

                    if (selectedRowsIdsAllPages.indexOf(idKey) === -1) {  // assume all Strings not int and String
                        delete this.selectedRows[idKey];  // no longer selected
                    }
                }
            }

            /* can only get current selected rows data from current page (table) */
            var underLyingTable = this.getUnderLyingTable();
            if (underLyingTable) {
                var currentPageSelectedRows = underLyingTable.getSelectedRows();

                for (var i = 0; i < currentPageSelectedRows.length; i++) {
                    var selectedRowId = currentPageSelectedRows[i].getData().id;

                    if (selectedRowsIdsAllPages.indexOf(selectedRowId) !== -1 || selectedRowsIdsAllPages.indexOf("" + selectedRowId) !== -1) {

                        /* options.model so can call columns directly, eg. selectedConflictsRows[0].options.model.profileName */

                        this.selectedRows[selectedRowId] = currentPageSelectedRows[i].options.model;  // no duplicates
                    }
                }
            }

        },

        /**
         * Fetch data for current page displayed (supports sorting and filtering)
         *
         * request : {
         * sortAttr: 'username', // {string} attribute name
         * sortDir: 'asc', // {string} sorting order, 'asc' / 'desc'
         * limit: 50, // {int}    amount of items starting from the offset
         * offset: 0, // {int}    item index from which request starts
         * pageIndex: 1, // {int}    page index, 1 based
         * filters: {} // {object} object describing the filters applied
         *
         * @param request
         */
        fetchPaginatedData: function (request) {

            return new Promise(function (resolve, reject) {

                // change if change filter, etc.
                if (JSON.stringify(request) === this.cachedRequest && this.backgroundTableRefresher.hasReadyData()) {

                    this.promiseSuccess(resolve, this.backgroundTableRefresher.getRowData());
                    return;

                }

                if (this.pageXhr) {
                    this.pageXhr.abort();
                }

                this.cachedRequest = JSON.stringify(request);

                this.requestParams = this.getParamsFromRequest(request);

                var queryParams = "";
                if (this.urlQueryParams) {
                    for (var key in this.urlQueryParams) {
                        if (urlQueryParams.hasOwnProperty(key)){
                            queryParams += "&" + key + "=" + this.urlQueryParams[key];
                        }
                    }
                }

                this.cachedUrlToSend = this.url + (this.requestParams + queryParams);

                this.pageXhr = ajaxService.getCall({

                    url: this.cachedUrlToSend,

                    success: this.promiseSuccess.bind(this, resolve),

                    error: function (message, response) {

                        if (typeof this.onErrorHandler === 'function') {
                            this.onErrorHandler(message, response);
                        } else {
                            reject(message, response);   // client SDK error handling displays (Error - Internal Server Error)

                        }
                    }.bind(this)


                });
            }.bind(this));
        },

        /**
         * @param resolve
         * @param response
         */
        promiseSuccess: function (resolve, response) {
            resolve.call(this, response);  // client SDK handling populating grid (eventually - no callback on when populated)

            /* add our own extras outside client sdk */
            var rowCountCurrentPage = (response.items) ? response.items.length : 0; // might be safer than response.total  (all pages)
            this.handleOnFetchSuccess(rowCountCurrentPage, this.requestContainsFilter(this.requestParams));

        },


        /**
         * Post Client SDK Handling of fetch success.
         * Intercept to change message to suit our grid (server would say "No Data = the request returned no data to display"
         * with table settings and row counter and filter still showing)
         *
         * Note there will be a race condition with client SDK paginated layout widget (#onFetchSuccess - i.e. resolve)
         * so we do not know if grid is actually populated at this point !!!
         *
         * @param rowCount  row count retrieved for current page
         *                  If following page limit change would equals page limit.
         *                  (does not mean rows are not selected on other pages)
         *
         * @param isDataFiltered  The data could be filtered - in which case would not want to over-write any
         *                        empty messages (as will need to keep clear filter options)
         */
        handleOnFetchSuccess: function (rowCount, isDataFiltered) {


            // note has to be called (even if 0) to show call complete
            // (grid is may srill not actually be populated at this point - see Mutation handling in this class)
            this.paginatedLayoutRowSelectionHandlerFunction().handleGridPopulation(rowCount);  // rowCount can be 0

            if (rowCount === 0) {
                this.removeTableContextMenuEventHandler();  // remove so will get them back when table is populated again
            }


            if (rowCount === 0 && !isDataFiltered) {
                if (Utils.isDefined(this.showEmptyGridMessage)) {
                    this.showEmptyGridMessage(true);
                }

            } else {
                if (Utils.isDefined(this.showEmptyGridMessage)) {
                    this.showEmptyGridMessage(false);
                }
            }
        },

        /**
         * Parameters for server request supporting sorting and filtering
         *
         * @param  request :
         *  sortAttr: {string} attribute name, e.g. 'profileName'
         *  sortDir: "asc" or "desc"
         *  filters:{"profileName":"myProfile name"}
         *  pageIndex: {int}    page index, 1 based
         *  offset:  item index from which request starts
         *  limit:   amount of items starting from the offset
         *  networkTechnology:LTE
         */
        getParamsFromRequest: function (request) {

            var returnParams = "?offset=" + request.offset + "&limit=" + request.limit;

            if (this.showSortingOptions) {

                var sortAttr;
                if (Utils.isDefined(request.sortAttr)) {
                    sortAttr = request.sortAttr;
                } else if (this.overRiddenSortColumn) {
                     sortAttr = this.overRiddenSortColumn;
                } else {
                    sortAttr = this.DEFAULT_SORT_COLUMN;
                }
                var sortDir = Utils.isDefined(request.sortDir) ? request.sortDir : this.DEFAULT_SORT_DIR;
                returnParams = returnParams + "&sortAttr=" + sortAttr + "&sortDir=" + sortDir;
            }

            if (this.showFilteringOptions) {
                var filters = JSON.stringify((Utils.isDefined(request.filters)) ? request.filters : {});
                returnParams = returnParams + "&filters=" + filters;
            }
            return returnParams;
        },


        /**
         * Method required to be present for paginated layout grid to work
         * @returns {Promise}
         */
        getAllIds: function () {

            return new Promise(function (resolve, reject) {

                if (this.backgroundTableRefresher.hasReadyData()) {

                    resolve(this.backgroundTableRefresher.getAllIds());
                    return;

                }

                ajaxService.getCall({
                    url: this.getAllIdsURL,
                    success: function (response) {
                    	var ids = response.ids;
                        /* assumes server passing an array of Ids directly - we do not have to intercept and can pass straight to SDK */
                        return resolve(ids);  // assumes server passing an array of Ids directly
                    }.bind(this),


                    error: function (message, response) {

                        if (typeof this.onErrorHandler === 'function') {
                            this.onErrorHandler(message, response);
                        } else {
                            reject(message, response);   // client SDK error handling displays (Error - Internal Server Error)

                        }
                    }.bind(this)

                });

            }.bind(this));
        },

        requestContainsFilter: function (requestParameters) {

            var filterParams = Utils.getItemValueFromQueryParams(requestParameters, "filters");
            // shorter than Object.keys(JSON.parse(filterParams)).length === 0
            return filterParams !== "{}";
        },


        /* expose for junit */
        getSelectedInfoHolder: function (tableHeader) {
            return tableHeader.getElement().find(Constants.clientSDKClassNames.TABLE_LIB_HEADER_SELECTED);
        },


        showLoader: function () {
            if (!Utils.isDefined(this.extraLoader)) {

                this.extraLoader = new Loader();

                /* this moves a  bit from ( this.paginatedTable.view.getBody()), but is necessary to
                 not allow pressing the clear option visible for disabled grid momentarily (with incorrect selected count)
                 when changing pages */

                this.extraLoader.attachTo(this.getElement());
            }
        },


        hideLoader: function () {
            if (Utils.isDefined(this.extraLoader)) {
                this.extraLoader.destroy();
                delete this.extraLoader;
            }

        },

        /*  Using unsupported SDK methods to add features not supported by SDK */

        getTableHeader: function () {
            if (typeof this.paginatedTable.getTableHeader === 'function') {
                return  this.paginatedTable.getTableHeader();
            } else {
                Utils.log("GenericPaginatedLayoutTable : Unable to use unsupported method #getTableHeader");
            }

        },

        getUnderLyingTable: function () {
            if (Utils.isDefined(this.paginatedTable)) {
                if (typeof this.paginatedTable.getTable === 'function') {
                    return this.paginatedTable.getTable();
                } else {
                    Utils.log("GenericPaginatedLayoutTable : Unable to use unsupported method #getTable");
                }
            }
        },


        /* warning client SDK hack using unpublished method  #onTableSelectAllOnAllPages */
        selectRowsOnAllPages: function () {
            if (this.isSelectAllChecksOnAllPages()) {
                if (typeof this.paginatedTable.onTableSelectAllOnAllPages === 'function') {
                    this.paginatedTable.onTableSelectAllOnAllPages();

                } else {
                    Utils.log("GenericPaginatedLayoutTable : Unable to use unsupported method #onTableSelectAllOnAllPages");
                }
            }
        },

        /**
         * Utility to get total row count - all grids
         * SDK hack using unpublished method #getDataInfoById
         */
        getGridRowCount: function () {
            if (typeof this.paginatedTable.getDataInfoById === 'function') {
                var dataInfoIds = this.paginatedTable.getDataInfoById();  // (let tests fail if this function no longer exists)
                return Utils.isDefined(dataInfoIds) ? Object.keys(dataInfoIds).length : 0;  // 0 is bad data


            } else {
                Utils.log("GenericPaginatedLayoutTable : Unable to use unsupported method #getDataInfoById");
                return 0;
            }
        },


        /**
         * Clear row selection on all pages
         * (this would not be necessary if our server used ids only)
         *
         * TODO  Warning SDK HACK
         * WARNING: Using non-published SDK methods inside PaginatedTable, #onTableSelectionClear
         */
        clearAllRowSelectionOnAllPages: function () {
            this.preRefreshSelectedIds = [];
            this.removeEventHandlers(); // avoid infinite loop

            if (typeof this.paginatedTable.onTableSelectionClear === 'function') {
                this.paginatedTable.onTableSelectionClear();
                this.clearSelectedRowsCache();

            } else {
                Utils.log("GenericPaginatedLayoutTable : Unable to use unsupported method #onTableSelectionClear");
            }

            this.addEventHandlers();
        },

        /**
         * Add content menu item if not added already
         *
         * Method which can only be called after table is populated
         * (#getTable returns an object)
         *
         * TODO  Warning SDK HACK
         * WARNING: Using non-published SDK methods inside PaginatedTable, #getTable
         */
        addTableContextMenuEventHandlerOnce: function () {

            if (!Utils.isDefined(this.contextMenusEventId)) {

                var underLyingTable = this.getUnderLyingTable();
                if (underLyingTable) {

                    this.contextMenusEventId = underLyingTable.addEventHandler('rowevents:contextmenu', function (row, contextEvent) {
                        showRightClickOptions(underLyingTable, this.getCurrentContextActions, contextEvent);
                    }.bind(this));
                }
            }
        },


        /**
         * Utility to completely hide access to filter component
         *
         * TODO  Warning SDK HACK
         * WARNING: Using non-published SDK methods inside PaginatedTable, #getTableHeader()
         * (Filter is compulsory in API)
         *
         * @param showFilter   true to show filter widget on table header (default), false to hide completely
         */
        showFilterOption: function (showFilter) {

            var tableHeader = this.getTableHeader();
            if (tableHeader) {

                var filterButton = tableHeader.getElement().find(Constants.clientSDKClassNames.TABLE_LIB_HEADER_FILTER);
                if (filterButton) {
                    Utils.showElementInlineBlock(filterButton, showFilter);
                } else {
                    Utils.log("GenericPaginatedLayoutTable : Unable to find unsupported SDK div  " + Constants.clientSDKClassNames.TABLE_LIB_HEADER_FILTER);
                }
            }
        },

        /**
         * Utility to completely hide access to Table Settings button
         *
         * TODO  Warning SDK HACK
         * WARNING: Using non-published SDK methods inside PaginatedTable, #getTableHeader()
         *
         * @param showFilter   true to show filter widget on table header (default), false to hide completely
         */
        showTableSettingsOption: function (showTableSettings) {

            var tableHeader = this.getTableHeader();
            if (tableHeader) {

                var tableSettingsButton = tableHeader.getElement().find(Constants.clientSDKClassNames.TABLE_LIB_TABLE_SETTINGS);
                if (tableSettingsButton) {
                    Utils.showElementInlineBlock(tableSettingsButton, showTableSettings);
                } else {
                    Utils.log("GenericPaginatedLayoutTable : Unable to find unsupported SDK div  " + Constants.clientSDKClassNames.TABLE_LIB_TABLE_SETTINGS);
                }
            }
        }


    });


    /**
     * Handle event triggered for when the selection on the table changed
     *
     * This is in place to support case where server does not just want Ids from
     * the selected rows (which may be on pages not currently displayed.
     * (If that never proves to be the case - this handling can be removed)
     */
    function rowSelectionChangeHandler() {


        if (this.isSelectAllCheckActive === true) {

            /* If our server does not just need cached ids,
             we need to have actually visited the page  (have information in this.selectedRows).
             We can not use default SDK behavior that when say un-select one row after using "the select all on all pages" - all others
             are still selected) -  so we need to clear selection on all page - if un-selects one   (the only other solution is
             for server side to accept "id" instead for use cases) */

            this.clearAllRowSelectionOnAllPages();     // user will have to select again

        }

        this.isSelectAllCheckActive = false;

        this.updateSelectedRowsCache();

        var selectedRowCount = this.paginatedTable.getSelectedIds().length;

        this.paginatedLayoutRowSelectionHandlerFunction().selectChange(selectedRowCount, this.cachedNumPrevSelectedRows);

        this.cachedNumPrevSelectedRows = selectedRowCount;


    }

    /**
     * Handle event triggered when the all pages are selected
     * (pressed "select all xxx on all pages" link)
     */
    function selectAllRowsOnAllPagesHandler() {

        this.isSelectAllCheckActive = true;

        /* we do not pass any row information to server when select all pages */
        this.clearSelectedRowsCache();
        this.paginatedLayoutRowSelectionHandlerFunction().selectAllOnAllPages();

    }

    /**
     * Adding context menu to underlying table
     *
     * @param table           this.paginatedTable.getTable() which must exist
     * @param contextMenuAction  supplied menu items - function or array supported
     * @param contextEvent       passed from "rowevents:contextmenu" event
     */
    function showRightClickOptions(table, contextMenuAction, contextEvent) {

        var selectedRows = table.getSelectedRows();

        if (selectedRows.length > 0) {
            var contextMenuActions;

            if (typeof contextMenuAction === 'function') {  // a function based on row selection
                contextMenuActions = contextMenuAction();
            } else {
                contextMenuActions = [contextMenuAction];
            }

            container.getEventBus().publish("contextmenu:show", contextEvent, contextMenuActions);
        } else {
            container.getEventBus().publish("contextmenu:hide");
        }
    }

    /**
     * Create Filter form   (mandatory method for paginated table)
     * @param filters                Pass the existing filters to restore the form with the last filters applied
     * @returns {this.FilterForm}    filter type is suitable for grid
     */
    function getTableFilterForm(filters) {

        return new this.FilterForm({
                data: filters
            }
        );
    }


    /**
     * Set list of plugins currently support in
     * this paginated grids
     *
     * @returns {Array}
     */
    function getPlugins() {

        // expandable icon has to be first column (0 index)

        var plugins = [];

        if (Utils.isDefined(this.colorBandPluginFunction)) {
            plugins.push(new ColorBand({color: this.colorBandPluginFunction})); // has to be included before any other plug in
        }

        if (Utils.isDefined(this.expandableContent)) {
            plugins.push(
                new ExpandableRows({
                    content: this.expandableContent
                })
            );
        }

        if (this.showSortingOptions) {
            plugins.push(new SortableHeader());
        }

        if (this.showCheckBoxes) {
            plugins.push(
                new Selection({
                    checkboxes: true,
                    selectableRows: true,
                    multiselect: this.isMultiSelect, // almost no point in making single - as can add row on next paginated grid page
                    bind: true
                })
            );
        } else {
            plugins.push(new Selection());
        }


        // can not mix Fix Header and StickyHeader (use one or the other)
        if (Utils.isDefined(this.fixedHeight)) {
            plugins.push(
                new FixedHeader({maxHeight: this.fixedHeight})
            );
        } else {
            plugins.push(
                new StickyHeader({
                    topOffset: 33
                }),
                new StickyScrollbar()
            );
        }

        plugins.push(
            new ResizableHeader(),   //   note that columns must specify an initial "width"
            new SmartTooltips(),

            new RowEvents({
                events: ['contextmenu']
            }));

        return plugins;
    }

    return GeneralPaginatedLayoutTable;
})
;

