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
    './StatusCellView',
    "jscore/core",
    "tablelib/Cell"
], function (Constants, Dictionary, View, core, Cell) {

    return Cell.extend({

        View: View,

        setValue: function (status) {
            status =  replaceNullIfFound(status);

            this.setText(status);

            this.setStatusDotColor(status);
        },

        setText: function(status) {
            var localizedString = (status) ? localizedString = Dictionary.get("serverConstants." + status.toUpperCase()) : "";
            this.view.setText(localizedString);
        },

        setStatusDotColor: function(status) {
            var color = getColorByStatus(status);
            if (color) {
                this.view.setStatusDotColor(color);
            }
        }
    });

    function replaceNullIfFound(value) {
        return (value === null) ? "" : value;  // some display that will not upset filter
    }

    function getColorByStatus(status) {
        switch(status) {
        case Constants.serverConstants.ACTIVE: return "green";
        case Constants.serverConstants.INACTIVE: return "red";
        case Constants.serverConstants.COMPLETED: return "green";
        case Constants.serverConstants.FAILED: return "red";
        case Constants.serverConstants.FILTERED: return "orange";
        case Constants.serverConstants.ERROR: return "black";
        case Constants.serverConstants.IN_PROGRESS: return "paleBlue";
        }
    }
});
