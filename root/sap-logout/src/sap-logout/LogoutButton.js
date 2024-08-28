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
 * User: EEICMSY
 * Date: 10/06/18
 */
define([
    "container/SystemBarComponent",
    "i18n!eso-commonlib/dictionary.json",
    'eso-commonlib/Constants',
    'eso-commonlib/UrlConstants',
    'eso-commonlib/DialogUtils',
    'eso-commonlib/Utils'
], function (SystemBarComponent, Dictionary, Constants, UrlConstants, DialogUtils, Utils) {

    /**
     * Bespoke Logout button
     * (Not localizing the SDK version very well)
     */

    return SystemBarComponent.extend({

        onStart: function () {
            this.setCaption(this.getCaption());
            this.setIcon(this.resolveIconPath("../resources/sap-logout/Logout.svg"));
            this.setAction(this.logOutActionHandler.bind(this));

        },

        logOutActionHandler: function () {
            var header = this.getLogoutHeader(),
                messageLineOne = Dictionary.logout.LOGOUT_MESSAGE,
                actionCaption = Dictionary.logout.ACTION_CAPTION;

            DialogUtils.showWarningDialogWithActionAndCancel(header, messageLineOne, undefined, actionCaption, this.doLogout.bind(this));

        },

        doLogout: function () {
            Utils.removeTokenCookie();
            Utils.removeUserCookie();
            Utils.clearAllSessionStorageEveryWhere();

            window.location.assign(UrlConstants.RE_DIRECT_LOG_IN_PAGE_URL);

        },

        getCaption: function () {
            var userName = Utils.getUserName();
            var caption;
            if (userName !== "") {
                caption = Dictionary.logout.LOGOUT_CAPTION_WITH_USER;
                caption = caption.replace("{0}", userName);
            } else {
                caption = Dictionary.logout.LOG_OUT;
            }
            return caption;
        },

        getLogoutHeader: function () {
            var userName = Utils.getUserName();
            var header;
            if (userName !== "") {
                header = Dictionary.logout.LOGOUT_HEADER_WITH_USER;
                header = header.replace("{0}", userName);
            } else {
                header = Dictionary.logout.LOGOUT_HEADER;
            }
            return  header;
        }

    });

});
