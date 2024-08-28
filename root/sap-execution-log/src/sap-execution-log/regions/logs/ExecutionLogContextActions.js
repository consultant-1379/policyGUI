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
    'i18n!eso-commonlib/dictionary.json',
    'container/api',
    '../../widgets/logDetails/LogDetailsFlyout',

    'eso-commonlib/AjaxService',
    'eso-commonlib/Constants',
    'eso-commonlib/HttpConstants',
    'eso-commonlib/UrlConstants',
    'eso-commonlib/DialogUtils'

], function (core, Dictionary, container, LogDetailsFlyout, ajaxService, Constants, HttpConstants, UrlConstants, DialogUtils) {
    'use strict';

    /**
     * This class handling actions for when
     * select top section options for the App
     * when row or row selected (context actions)
     *
     * (e.g. View Details)
     */

    return core.AppContext.extend({

        /**
         * Init
         * @param options
         *      getSelectedRows : get current select rows
         *      getSelectedIds  : get current selected row ids
         */
        init: function (options) {
            this.options = options ? options : {};
            this.getSelectedRows = this.options.getSelectedRows;
            this.getSelectedIds = this.options.getSelectedIds;
            this.eventBus = this.options.eventBus;
        },

        viewDetails: function () {
            var selectedIds = this.getSelectedIds();
            if (selectedIds.length === 0) {
                return; // should never happen
            }

            this.showLoadingAnimation(true, "loadingMessage");

            var url = UrlConstants.log.LOGS_GRID_DETAILS_DATA;
            url = url.replace("{0}", selectedIds[0]);

            ajaxService.getCall({
                url: url,
                success: this.onGetDetailsSuccess.bind(this),
                error: this.onGetDetailsError.bind(this)
            });
        },

        onGetDetailsSuccess: function(response) {
            this.showLoadingAnimation(false);

            container.getEventBus().publish('flyout:show', {
                header: Dictionary.titles.EXECUTION_LOGS,
                width: '700px',
                content: new LogDetailsFlyout(response)
            });
        },

        onGetDetailsError: function (code, response) {
            this.showLoadingAnimation(false);
            if (DialogUtils.isSecurityDeniedResponse(response)) {  // unrecoverable (will have to re-login again)
                DialogUtils.showForbiddenDialog(Dictionary.get("forbiddenActionMessages.READ_EXECUTION_LOG_DETAILS"));
            } else {
                var errorHeader = Dictionary.get("dialogMessages.HEADER_UNABLE_TO_VIEW_LOG_DETAILS");
                DialogUtils.showError(errorHeader, response);
            }
        },

        /**
         * This loading animation shall block out the whole page
         * whilst delete is on-going (no access to top section buttons)
         *
         * @param isShow - if true the loader is displayed, otherwise it is destroyed
         */
        showLoadingAnimation: function (isShow, loadingMessage) {
            this.eventBus.publish(Constants.events.LOADING_EVENT, isShow, loadingMessage);
        }
    });
});
