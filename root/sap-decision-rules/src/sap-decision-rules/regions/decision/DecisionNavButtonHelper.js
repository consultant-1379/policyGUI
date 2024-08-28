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
    './../../Dictionary'
],
    function (Dictionary) {
        'use strict';

        /**
         * Class responsible for buttons that appear in the
         * Navigation Bar when viewing the Policies Application
         *
         * Note: Any Default option(s) when nothing are selected is in
         * this.getDecisionRegion().getDefaultActions()
         */

        return {

            getActionsWhenRowsSelected: function (deleteSelection, editSelection, activateSelection, deactivateSelection) {

                var actions = [];
                if (deleteSelection) {
                    actions.push({
                        name: Dictionary.captions.DELETE,
                        type: "button",
                        icon: "delete",
                        action: deleteSelection
                    });
                }

                if (editSelection) {
                    actions.push({
                        name: Dictionary.captions.EDIT,
                        type: "button",
                        icon: "edit",
                        action: editSelection
                    });
                }

                if (activateSelection) {
                    actions.push({
                        name: Dictionary.captions.ACTIVATE,
                        type: "button",
                        icon: "tick",
                        action: activateSelection
                    });
                }

                if (deactivateSelection) {
                    actions.push({
                        name: Dictionary.captions.DEACTIVATE,
                        type: "button",
                        icon: "cancelled",
                        action: deactivateSelection
                    });
                }

                return actions;
            }
        };
    });
