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
define([
    'eso-commonlib/Constants'

], function (Constants) {

    /**
     * Class containing some standard utils methods used through-out code
     */
    return {

        ISDEBUGGING: true,  // can turn this off on a final production run

        /**
         * Log method preferred to enable turning of log for production mode
         * (In most all cases the Browser Developer Tools will tell us
         * all we need to know)
         *
         * @param msg        message being displayed
         * @param response   error response
         */
        log: function (clientPartOfMessage, errorResponse) {
            if (this.ISDEBUGGING) {
                var serverPart = '';
                if (typeof errorResponse !== 'undefined' && typeof errorResponse.getResponseText === 'function') {
                    serverPart = ", Reason: " + errorResponse.getResponseText();
                }
                console.log(clientPartOfMessage + serverPart);
            }

        },

        clearAllSOSessionStorage: function () {

            var soSessionStorageKeys = Object.keys(sessionStorage);

            if (this.checkStorage()) {

                for (var i = 0; i < soSessionStorageKeys.length; i++) {
                    if ((soSessionStorageKeys[i].startsWith("so:"))) {
                        window.sessionStorage.removeItem(soSessionStorageKeys[i]);
                    }
                }
            }
        },

        /**
         * Keycloak logout has some unknown session storage
         * we have to remove
         */
        clearAllSessionStorageEveryWhere: function () {
            if (this.checkStorage()) {
                window.sessionStorage.clear();
            }
        },

        /**
         * Creates a new object using the properties of the passed objects.
         * (used for Dictionary)
         *
         * @method mergeObjects
         * @param {Object} obj1
         * @param {Object} obj2
         * @return {Object} mergedObject
         */
        mergeObjects: function (obj1, obj2) {
            var output = {};
            var prop;
            for (prop in obj1) {
                output[prop] = obj1[prop];
            }

            for (prop in obj2) {
                output[prop] = obj2[prop];
            }

            return output;
        },

        isDefined: function (obj) {
            return typeof obj !== 'undefined';
        },


        /**
         * Remove all elements from DOM element
         * @param divElement    (containing #getNative or #hasChildNodes method)
         */
        removeAllChildrenFromElement: function (divElement) {

            var domNode;

            if (divElement) {
                if (typeof divElement.hasChildNodes === 'function') {
                    domNode = divElement;
                } else if (typeof divElement.getNative === 'function') {
                    domNode = divElement.getNative();
                }
            }

            if (domNode) {
                while (domNode.hasChildNodes()) {
                    /* remove any existing items */
                    domNode.removeChild(domNode.lastChild);
                }

            } else {
                this.log("Utils #removeAllChildrenFromElement failed");
            }
            return divElement;

        },

        /**
         * Check browser compatibility to use local storage
         * @returns {boolean}
         */
        checkStorage: function () {
            if (typeof(Storage) !== 'undefined') {
                return true;
            } else {
                if (this.ISDEBUGGING) {
                    console.log("Local and Session storage not supported to save to local storage");
                }
                return false;
            }
        },

        /**
         * Convert to a format that can be used to populate a select box
         *
         * @param arrayOfItems  Array of Name Strings
         * @returns {Array}
         */
        convertToSelectBoxItems: function (arrayOfItems) {
            var items = [];
            for (var i = 0; i < arrayOfItems.length; i++) {
                var item = arrayOfItems[i];
                items.push({
                    name: item,
                    value: item,   // for as long as using name as id
                    title: item
                });
            }
            return items;
        },

        /**
         * Convert to a format that can be used to populate a select box
         * @param arrayOfItems   Sample items response from a grid data call,
         *                       e.g [   {
         *                       "description": null
         *                       "id": "081a7fea-d142-4b26-9f6c-3da2cd29e82d",
         *                       "name": "massive-mtc",
         *                       "serviceTemplateFileName": "massive.yaml",
         *                       "uploadTime": "2017-12-19 13:55 GMT
         *                       }, {}, {}]
         ]
         * @returns {Array}
         */
        convertToSelectBoxItemsWhenHaveNamesWithIds: function (arrayOfItems) {
            var items = [];
            for (var i = 0; i < arrayOfItems.length; i++) {
                var item = arrayOfItems[i];
                items.push({
                    name: item.name,
                    value: item.id,
                    title: item.description
                });
            }
            return items;
        },

        removeNewLines: function (data) {
            var str = JSON.stringify(data);
            var quotesReplace = new RegExp('\\\\n', 'g');
            str = str.replace(quotesReplace, ' ');    // add a space too to avoid text sticking together
            data = JSON.parse(str);
            return data;
        },

        /**
         * Remove all keys out of JSON object except those you wish to keep
         * @param jsObject          JSON object
         * @param keysToKeep        Array of keys in object to keep
         */
        deleteKeysInJavaScriptObjectExceptKeys: function (jsObject, keysToKeep) {

            var keepArray = (keysToKeep instanceof Array ? keysToKeep : []);

            if (keepArray.length !== 0) {
                for (var key in jsObject) {
                    if (jsObject.hasOwnProperty(key)) {
                        if (keepArray.indexOf(key) === -1) {   // not found delete wanted
                            delete jsObject[key];
                        }
                    }
                }

            }
        },

        /**
         * Get Cookie value
         * @param cname      cookie name
         * @returns {*}      value for cookie or empty String
         */
        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        removeTokenCookie: function () {  // separate out for SONAR
            var tokens = Constants.loginTokens;  // array
            if (tokens  instanceof Array) {
                for (var i = 0; i < tokens.length; i++) {
                    document.cookie = tokens[i] + "=; Max-Age=0;path=/";
                }
            }
        },

        removeUserCookie: function () {   // separate out for SONAR
            document.cookie = Constants.cookies.USER_NAME + "=; Max-Age=0;path=/";
        },

        /**
         * Remove the specified keys from the JSON object
         * @param jsObject        JSON object
         * @param keysToDelete      Array of keys in object to remove
         */
        deleteKeysInJavaScriptObject: function (jsObject, keysToDelete) {

            var deleteArray = keysToDelete instanceof Array ? keysToDelete : [];

            if (keysToDelete.length !== 0) {
                for (var key in jsObject) {
                    if (jsObject.hasOwnProperty(key)) {
                        if (deleteArray.indexOf(key) !== -1) {   // found delete wanted
                            delete jsObject[key];
                        }
                    }
                }
            }
        },


        /**
         * Change a plain old java object into an array (the server wants it) format with "key" and "value"
         *  [
         *    {
         *      "key": "name1",
         *       "value": "value1"
         *    },
         *    {
         *      "key": "name2", "value": "value2" }
         *  ]
         *
         *
         * @param jsonObject  standard JSON object,
         *                    e.g.   {RoamingEnabled:false,Service Template: "081a7fea-d142-4b26-9f6c-3da2cd29e82d-2"
         */
        convertToKeyValueArray: function (jsonObject) {
            var returnArray = [];

            for (var key in jsonObject) {
                if (jsonObject.hasOwnProperty(key)) {
                    returnArray.push({
                        "key": key,
                        "value": jsonObject[key]});
                }
            }
            return returnArray;
        },


        /**
         * Utility showing or hiding (as apposed to detaching) an element
         * Display used is "inline-block"
         *
         * @param widget    element
         * @param isShow    true to show, false to hide element from display
         */
        showElementInlineBlock: function (element, isShow) {
            if (typeof element !== 'undefined') {
                element.setStyle("display", (isShow) ? "inline-block" : "none");
            }
        },

        /**
         * Launch print preview with data to print
         * @param data         data to print (String formatted as desired),
         *                     i.e. JSON.stringify object (with tab parameters) if required
         * @param printTitle   title for window launched and written to page
         */
        printData: function (data, printTitle) {

            var strWindowFeatures = "URL='',height=400,width=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";
            var myWindow = window.open('', 'PRINT', strWindowFeatures);

            var windowTitle = (printTitle) ? printTitle : document.title;   // on launched browser print-preview

            myWindow.document.write('<html><head><title>' + windowTitle + '</title>');
            myWindow.document.write('</head><body >');
            myWindow.document.write('<h2>' + windowTitle + '</h2>');
            myWindow.document.write('<pre>');
            myWindow.document.write(data);
            myWindow.document.write('</pre></body></html>');

            myWindow.document.close();
            myWindow.focus();

            myWindow.print();
            myWindow.close();
            return true;
        },


        /**
         * Use to check if should display Copy to Clipboard options
         * (perhaps won't be able to in Safari (iPad)
         * @returns {boolean}   true if can show copy to clipboard options
         */
        isCopyToClipBoardSupported: function () {
            return typeof document.execCommand === 'function';
        },


        /**
         * Action to copy data to clipboard
         * @param data         data to copy to clipboard (String formatted as desired),
         *                     i.e. JSON.stringify object (with parameters) if required
         * @returns {boolean}   true if data copied to clipboard
         */
        copyToClipBoard: function (data) {

            var id = "eso_clipboard-textarea-hidden-id";
            var existsTextArea = document.getElementById(id);

            if (!existsTextArea) {

                var textArea = document.createElement("textarea");
                textArea.id = id;
                // Place in top-left corner of screen regardless of scroll position.
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;

                // Ensure it has a small width and height. Setting to 1px / 1em
                // doesn't work as this gives a negative w/h on some browsers.
                textArea.style.width = '1px';
                textArea.style.height = '1px';

                // We don't need padding, reducing the size if it does flash render.
                textArea.style.padding = 0;

                // Clean up any borders.
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';

                textArea.style.background = 'transparent';

                document.querySelector("body").appendChild(textArea);
                // The text area now exists
                existsTextArea = document.getElementById(id);
            }
            // seems to work if do twice
            existsTextArea.value = data;
            existsTextArea.focus();
            existsTextArea.select();
            document.execCommand('copy');

            existsTextArea.value = data;
            existsTextArea.focus();
            existsTextArea.select();
            return document.execCommand('copy');

        },

        /**
         * Utility showing or hiding (as apposed to detaching) an element
         * Display used is "inline"
         *
         * @param widget    element
         * @param isShow    true to show, false to hide element from display
         */
        showElementInline: function (element, isShow) {
            if (typeof element !== 'undefined') {
                element.setStyle("display", (isShow) ? "inline" : "none");
            }
        },

        /**
         * Look for parameter from hash or URL,
         * e.g. "?offset=0&limit=50&sortAttr=name&sortDir=asc&filters={}
         * or say  window.location.hash
         *
         * @param queryParameters  e.g. window.location.hash,
         * @param paramKey         e.g. "filters"
         *
         * @returns {*}  parameter value or undefined if not found
         */
        getItemValueFromQueryParams: function (queryParameters, paramKey) {
            var params = getQueryParams(queryParameters);
            return params[paramKey];  // can be undefined

        },

        /**
         * Get user name from cookie
         * @returns {*}   user name or empty String
         */
        getUserName: function () {
            return this.getCookie(Constants.cookies.USER_NAME);

        }

    };

    function getQueryParams(query) {
        var params = {};
        (query.split('?')[1] || '').split('&').filter(function (val) {
            return val !== '';
        }).forEach(function (val) {
                var match = /^(.*)=(.*)$/g.exec(val) || [null, val, true];
                params[match[1]] = match[2];
            });
        return params;
    }
});
