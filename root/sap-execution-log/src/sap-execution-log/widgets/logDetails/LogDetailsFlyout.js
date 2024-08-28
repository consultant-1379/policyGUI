define([
    'jscore/core',
    './LogDetailsFlyoutView',
    'eso-commonlib/Constants',
    'widgets/Tabs',
    'eso-commonlib/JsonDisplayer',
    'i18n!eso-commonlib/dictionary.json',
], function (core, View, Constants, Tabs, JsonDisplayer, Dictionary) {

    return core.Widget.extend({

        view: function () {
            return new View({
                i18n: {
                    flyoutWidgetName: Dictionary.get(Dictionary.titles.EXECUTION_LOGS)
                }
            });
        },

        init: function (options) {
            this.options = (options) ? options : {};
        },
        
        onViewReady: function () {
            var tabs;
            if (this.options.status === Constants.serverConstants.COMPLETED) {
                tabs = this.createInputOutputTabs();
            } else {
                tabs = this.createInputNotesTabs();
            }
            var tabDiv = this.view.getTabDiv();
            tabs.attachTo(tabDiv);
        },

        createInputOutputTabs: function() {
            return new Tabs({
                tabs: [
                    {title: Dictionary.get(Dictionary.rawMessages.INPUT), content: this.createInputContent()},
                    {title: Dictionary.get(Dictionary.rawMessages.OUTPUT), content: this.createOutputContent()}
                    ]
            });
        },

        createInputContent: function() {
            
            return new JsonDisplayer({
                data: this.options.rawMessageInput,
                expandAll: true,
                showRawJson : true,
                showMenuBar: true,
                printTitle: Dictionary.get(Dictionary.rawMessages.INPUT)
            });
        },

        createOutputContent: function() {
            var outputMsg;
            if (this.options.rawMessageOutput) {
                outputMsg = this.options.rawMessageOutput;
            } else {
                outputMsg = Dictionary.get(Dictionary.rawMessages.NO_OUTPUT_AS_LOG_ONLY);
            }
            
            return new JsonDisplayer({
                data: outputMsg,
                expandAll: true,
                showRawJson : true,
                showMenuBar: true,
                printTitle: Dictionary.get(Dictionary.rawMessages.OUTPUT)
            });
        },

        createInputNotesTabs: function() {
            return new Tabs({
                tabs: [
                    {title: Dictionary.get(Dictionary.rawMessages.INPUT), content: this.createInputContent()},
                    {title: Dictionary.get(Dictionary.rawMessages.NOTES), content: this.createNotesContent()}
                    ]
            });
        },

        createNotesContent: function() {
            return new JsonDisplayer({
                data: this.options.notes,
                expandAll: true,
                showRawJson : true,
                showMenuBar: true,
                printTitle: "Notes"
            });
        }
    });
});
