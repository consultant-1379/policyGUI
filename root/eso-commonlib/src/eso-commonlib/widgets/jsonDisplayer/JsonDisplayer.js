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
 * Date: 15/02/18
 */

define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    'uit!./JsonDisplayer.html',
    'eso-commonlib/BoldFontCell',
    'eso-commonlib/JSONValueCell',
    'eso-commonlib/Utils',
    'eso-commonlib/DialogUtils',

    'widgets/Dialog',
    'widgets/InlineMessage',

    'widgets/Tree',
    'tablelib/Table',
    'widgets/Accordion',

    'tablelib/plugins/NoHeader'



], function (core, Dictionary, View, BoldFontCell, JSONValueCell, Utils, DialogUtils, Dialog, InlineMessage, Tree, Table, Accordion, NoHeader) {
    'use strict';


    /**
     * Generic Widget to take JSON data and
     * make a Table from it  (noheader,
     * two column table for key and value)
     *
     * When the value is an array of JSON create a tree of tables for each
     * item and place at the end of the widget    (an expandable table does not
     * really give this effect - and content is very dynamic)
     *
     * (e.g. display JSON in a flyout - one for each execution step details)
     *
     */

    return core.Widget.extend({

        // TODO Showing as accordians not really working (using showRawJson for production code for now)
        // TODO  An option for this class could be showTree and could convert the data to something
        // TODO that could be used by the Tree widget

        /**
         *  Initialise with a block of JSON
         *
         * @param options   e.g. for execution steps - a single step of data
         * data:     {
                id: "step0",
                name: "create",
                type: "Node",
                title: "create: fm-block-storage-1",
                node: "fm-block-storage-1",
                implementation: "scripts/create_storage.py",
                inputs: [
                    {
                        name: "size",
                        value: "1",
                        type: "integer"
                    }
                ],
                complete: false
            }
         */
        init: function (options) {
            this.options = options ? options : {};

            this.data = this.options.data;
            this.expandAll = (this.options.expandAll) ? this.options.expandAll : false;
            this.showMenuBar = (this.options.showMenuBar) ? this.options.showMenuBar : false;
            this.printTitle = this.options.printTitle;
            this.showRawJson = this.options.showRawJson;
        },

        view: function () {

            return new View({
                COPY: Dictionary.captions.COPY,
                PRINT: Dictionary.captions.PRINT
            });
        },

        /**
         * Method that will be called when the view is rendered
         */
        onViewReady: function () {

            this.setupMenuBar();

            if (typeof this.data === 'string') {
                var stringText = new core.Element('pre');
                stringText.setText(this.data);
                this.getRawJSONHolderInnerHTML().append(stringText.getNative());
            } else if (this.showRawJson) {
                var text = new core.Element('pre');
                text.setText(this.getFormattedDataString());
                this.getRawJSONHolderInnerHTML().append(text.getNative());
            } else {
                // table of JSON, tree when JSON value is an array of JSON
                var tableAndTrees = this.createTableAndTrees(this.data);
                var table = tableAndTrees.table;
                var trees = tableAndTrees.trees;

                table.attachTo(this.getTableHolder());

                var treeHolder = this.getTreeHolder();
                if (trees && trees.length > 0) {
                    for (var i = 0; i < trees.length; i++) {
                        trees[i].attachTo(treeHolder);
                    }
                }
            }
        },

        /**
         * junit
         */
        getRawJSONHolderInnerHTML: function () {
            return this.getRawJSONHolder().getNative();
        },

        setupMenuBar: function () {
            Utils.showElementInlineBlock(this.getMenuBar(), this.showMenuBar);

            if (this.showMenuBar) {
                var isCopySupported = Utils.isCopyToClipBoardSupported();

                Utils.showElementInline(this.getCopyButton(), isCopySupported);

                if (isCopySupported && typeof this.copyEventId === 'undefined') {
                    this.copyEventId = this.getCopyButton().addEventHandler("click", this.copyToClipBoard.bind(this));
                }

                /* print and copy both using the raw server response data */
                if (typeof this.printEventId === 'undefined') {
                    this.printEventId = this.getPrintButton().addEventHandler("click", Utils.printData.bind(this, this.getFormattedDataString(), this.printTitle));
                }

            }
        },

        copyToClipBoard: function (event) {
            var isCopied = Utils.copyToClipBoard(this.getFormattedDataString());
            if (isCopied === true) {
                var toastNotification = DialogUtils.createSuccessToastNotification(Dictionary.toasts.CLIPBOARD_UPDATED_TOAST);
                toastNotification.attachTo(this.getToastHolder());
            }
        },

        /**
         * Get text version of data that can be displayed (for print and clipnoard)
         * @returns {*}   displaybale text
         */
        getFormattedDataString: function () {

            if (!this.formattedDataString) {
                var spaceFormatLength = 4;
                this.formattedDataString = JSON.stringify(this.data, null, spaceFormatLength);  // space so printout and clipboard copy formated
            }
            return this.formattedDataString;
        },

        /**
         * Create Tree when value is an array
         * @param key                  e.g. "inputs"
         * @param dataArrayForKey      e.g. [{name: "size", value: "1", type: "integer"}],
         * @returns {widgets.Tree}
         */
        createTree: function (key, dataArrayForKey) {

            var treeItemData = [];

            var returnTrees = [];

            dataArrayForKey.forEach(

                function (jsonData) {

                    var tableAndTrees = this.createTableAndTrees(jsonData);

                    var content = tableAndTrees.table;

                    var children = [];

                    if (tableAndTrees.trees.length > 0) {
                        /* a value inside an array value - is also an array of json object(s) */
                        tableAndTrees.trees.forEach(function (tree) {

                            children = tree.options.items;

                        });

                        returnTrees = returnTrees.concat(tableAndTrees.trees);
                    }

                    treeItemData.push({
                        id: key,
                        labelContent: new Accordion({
                            title: key,
                            content: content,
                            expanded: this.expandAll
                        }),
                        label: key


                    });

                    if (children.length > 0) {
                        treeItemData.push({children: children});

                    }

                }.bind(this)
            );

            var displayTree = new Tree({
                items: treeItemData
            });
            return displayTree;
        },


        createTableAndTrees: function (jsonData) {

            var plugins = [
                new NoHeader()

            ];

            var data = [];

            var treeArray = [];
            for (var key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    if (typeof jsonData[key] === 'string') {
                        data.push({col1: key, col2: jsonData[key]});

                    } else if (jsonData[key] instanceof Array) {   // e.g. key "inputs" holds an array

                        if (jsonData[key].length > 0) {    // not {"inputs" : []}

                            // array handling arrays within json values also
                            treeArray = treeArray.concat(this.createTree(key, jsonData[key]));
                        }
                    } else if (typeof jsonData[key] === 'object') {

                        Utils.log("JSON displayer not handled level of nesting (not important if using showRawJson flag): " + key);

                    } else {
                        Utils.log("JSON displayer not handled (not important if using showRawJson flag): " + key);
                    }
                }
            }

            var table = new Table({
                plugins: plugins,
                data: data,
                columns: [
                    {title: Dictionary.columnTitles.ATTRIBUTE, attribute: 'col1', cellType: BoldFontCell, width: '150px'},
                    {title: Dictionary.columnTitles.VALUE, attribute: 'col2', cellType: JSONValueCell}
                ]
            });

            return {table: table,
                trees: treeArray
            };
        },

        /* DOM interaction */

        getContentHolder: function () {
            return this.findElementByClassName("-content");
        },

        getTableHolder: function () {
            return this.findElementByClassName("-table");
        },


        getTreeHolder: function () {
            return this.findElementByClassName("-arrayTree");
        },   // menubar

        getMenuBar: function () {
            return this.findElementByClassName("-menubar");
        },

        getCopyButton: function () {
            return this.findElementByClassName("-copybutton");
        },

        getPrintButton: function () {
            return this.findElementByClassName("-printbutton");
        },

        getToastHolder: function () {
            return this.findElementByClassName("-toastHolder");
        },

        getRawJSONHolder: function () {
            return this.findElementByClassName("-rawJSON");
        },

        /**
         * Adding prefix present on all divs in the widget's html
         * @param suffix   - end of the name
         * @returns {*}
         */
        findElementByClassName: function (suffix) {
            return this.getElement().find(".elEsoCommonlib-wJsonDisplayer" + suffix);
        }
    });


});
