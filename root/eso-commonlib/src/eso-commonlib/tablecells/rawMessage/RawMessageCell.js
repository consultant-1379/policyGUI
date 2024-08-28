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
    'eso-commonlib/Constants',
    'i18n!eso-commonlib/dictionary.json',
    './RawMessageCellView',
    "jscore/core",
    "tablelib/Cell"
], function (Constants, Dictionary, View, core, Cell) {

    return Cell.extend({

        View: View,

        setValue: function (status) {
            this.view.setButtonText(getRawMessage(status));
            this.eventHandlerId = this.view.getButton().addEventHandler('click', this.buttonClicked.bind(this));
        },

        buttonClicked: function() {
            var row = this.getRow();
            this.getTable().trigger('rowselectend', [row]);
        },

        onCellDestroy: function () {
            this.view.getButton().removeEventHandler(this.eventHandlerId);
            delete this.eventHandlerId;
        },
    });

    function getRawMessage(status) {
        if (Constants.serverConstants.COMPLETED=== status) {
            return Dictionary.get(Dictionary.rawMessages.INPUT_OUTPUT);
        } else {
            return Dictionary.get(Dictionary.rawMessages.INPUT_NOTES);
        }
    }
});
