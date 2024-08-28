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
 * User: eeicmsy
 * Date: 24/11/17
 */
define({

    /**
     * Define some constants, but note that anything that is shown to the customer will have to be
     * inside the localisation json (dictionary.json) for Dictionary lookup using the i18n plugin !!!
     */

    /**
     * info popup width that will suit all media (phone)
     */
    DEFAULT_INFO_POPUP_WIDTH: '300px',

    DEFAULT_DIALOG_WIDTH: '300px',
    /**
     * Any number of columns less than or equal to this will have 'zebra' - stripped rows
     */
    TABLE_COLUMN_COUNT_CUT_OFF_FOR_STRIPED_ROWS: 4,

    /**
     * hash for location changes (and toasts)
     */
    lcHash: {
        HASH: '#',
        EXECUTION_LOG: '#sap-execution-log',
        DECISION_RULES: '#sap-execution-log/sap-decision-rules'

    },

    /**
     * This tag is for any references to the on-line help pages
     * being made on the UI
     */
    helpInfo: {

    },

    /**
     * Constants which are passed from server,
     * agreed between server and client
     * (locale on these applied later but can trust this is what server passes)
     */
    serverConstants: {

        SECURITY_TOKEN: "AuthToken",
        SUCCESS_STATUS_MESSAGES: ['Active'],
        ERROR_STATUS_MESSAGES: ['Errored', 'Error'],
        IN_PROGRESS_STATUS_MESSAGES: ['InProgress'],

        IN_PROGRESS: 'In Progress',
        FAILED: 'Failed',
        ERROR: 'Error',
        COMPLETED: 'Completed',
        FILTERED: 'Filtered',
        NEW: "New",
        INACTIVE: "Inactive",
        ACTIVE: "Active",
        RAW_MESSAGE_INPUT_OUTPUT: "Input/Output",

        KEY_IN_EXCEPTION_USED_FOR_CUSTOMER_MESSAGES: "internalErrorCode",  // might change to say 'userMessage' if server passed dictionary keys in that

        "NAME": "Name",
        "TYPE":"Type",
        "PASSWORD": "Password"
    },


    /* for minimising hack impacts */
    clientSDKClassNames: {
        DIALOG_SECONDARY_TEXT: '.ebDialogBox-secondaryText',
        TABLE_LIB_HEADER_FILTER: '.elTablelib-lTableHeader-filter',
        TABLE_LIB_TABLE_SETTINGS: '.elTablelib-lTableHeader-settings',
        TABLE_LIB_TABLE_BODY: '.elTablelib-lPaginatedTable-body',
        TABLE_LIB_HEADING_HOLDER: '.elTablelib-lPaginatedTable-headerHolder',
        TABLE_LIB_HEADING_INFO_HOLDER: '.elTablelib-lTableHeader-infoHolder',
        MULTI_SLIDING_PANEL_H2: '.elLayouts-MultiSlidingPanels-leftHeader'
    },

    /*
    *
    * (localStorage is too much - won't pick up UI upgrade changes)
    */
//   sessionStorage: {
//       DASHBOARD_LAYOUT: "so:dashboard:layout",
//       TOPOLOGY_DASHBOARD_LAYOUT: "so:topology:layout",
//
//       PAGINATED_GRID_LAYOUT_PREFIX: "so:grid:layout_",  // append unique grid name
//
//       /**
//        * E.g. Used to determine what application to return to,
//        * were user to press cancel on Create Slice page
//        */
//       LAST_VISITED_APP_PAGE: "so:lastVisited",
//
//       /**
//        * Usually one row, e.g. passing whole row info to Create Network App
//        * (so becomes Edit Network app)
//        * Also when set can reselect rows in grid (so know where came from)
//        */
//       SELECTED_GRID_ROWS: "so:selectedRows",
//
//       EDIT_PROPERTIES: "so:editProperties",
//
//       HIDE_3PP_WARNING_SDD_DESIGNER : "so:sdd_designer"
//   },

    cookies: {
        USER_NAME: "so_user"
    },

    /**
     * Cookies (set from server responses) used in Keycloak login
     * (will need to remove these on log-out)
     */
    loginTokens: ["JSESSIONID", "AUTH_SESSION_ID", "KEYCLOAK_IDENTITY", "KEYCLOAK_SESSION"],

    events: {
        "LOADING_EVENT": "eso:loading"
    }

});
