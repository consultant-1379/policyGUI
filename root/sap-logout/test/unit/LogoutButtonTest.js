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
    'jscore/core',

    'jscore/ext/net',
    'sap-logout/LogoutButton',
    'eso-commonlib/DialogUtils'
], function (core, net, LogoutButton, DialogUtils) {
    'use strict';

    var sandbox, logoutButtonToTest;

    describe('LogoutButton Test (unit tests)', function () {

        beforeEach(function () {

            sandbox = window.sinon.sandbox.create();

            logoutButtonToTest = new LogoutButton({
                path: "sap-logout",
                properties: {
                    script: "sap-logout/LogoutButton",
                    title: "Log Out",
                    i18n: {locales: ["en-us"]}

                }
            });

            logoutButtonToTest.onStart();

        });

        afterEach(function () {

            sandbox.restore();
            document.cookie = "so_user" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        });

        it("should be defined", function () {
            expect(LogoutButton).to.be.defined;
        });

        describe("LogoutButton Tests", function () {

            describe('#onStart tests', function () {

                it("should have expected caption when can not find user", function () {

                    var expectedCaption = "Log Out";

                    expect(logoutButtonToTest.getCaption()).to.equal(expectedCaption);

                });

//                it("should have expected caption when can find user", function () {
//
//                    document.cookie = "so_user =" + "Jimmy";
//
//                    var expectedCaption = "Log Out Jimmy";
//
//                    expect(logoutButtonToTest.getCaption()).to.equal(expectedCaption);
//
//                });

                it("should have show Dialog as an action", function () {

                    sandbox.stub(DialogUtils, "showWarningDialogWithActionAndCancel");

                    logoutButtonToTest.getAction().call(logoutButtonToTest);

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0] === "Log Out");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[1] === "Are you sure you want to log out from Service Orchestration?");
                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[3] === "Log Out");

                });

                it("should have show Dialog with user name in header when available", function () {

                    sandbox.stub(DialogUtils, "showWarningDialogWithActionAndCancel");

                    document.cookie = "so_user =" + "TestServer User";

                    logoutButtonToTest.getAction().call(logoutButtonToTest);

                    expect(DialogUtils.showWarningDialogWithActionAndCancel.getCall(0).args[0] === "Log Out TestServer User");

                });

            });

            describe('#doLogout tests', function () {

                it("should change hash", function () {

                    sandbox.stub(window.location, "assign");

                    logoutButtonToTest.doLogout();

                    var expectedRedirect = "http://servir.seli.gic.ericsson.se/login/#sap-login";

                    expect(window.location.assign.getCall(0).args[0] === expectedRedirect);

                });
            });
        });
    });
});
