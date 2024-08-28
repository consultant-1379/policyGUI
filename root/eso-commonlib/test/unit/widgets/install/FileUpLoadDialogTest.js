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
 * Date: 05/03/18
 */
define([
    'jscore/ext/net',
    "jscore/core",
    "eso-commonlib/FileUploadDialog",
    'widgets/Dialog'
], function (net, core, FileUpLoadDialog, Dialog) {
    'use strict';

    var sandbox, fileUpLoadDialogToTest;

    describe('FileUploadDialog Test', function () {


        it("should be defined", function () {
            expect(FileUpLoadDialog).to.be.defined;
        });

        describe("FileUpLoadDialog Tests", function () {

            beforeEach(function () {
                sandbox = sinon.sandbox.create();

                sandbox.stub(Dialog.prototype, 'show');
                sandbox.stub(net, 'ajax');


                fileUpLoadDialogToTest = new FileUpLoadDialog({
                    postURL: '/onboarding/eso/v1.0/service-models',
                    eventBus: new core.EventBus(),
                    handleRefresh: function () {
                    },
                    dialogHeader: 'Install Policy',
                    hideNameField: false,
                    hideDescriptionField: false,
                    namePlaceHolder: 'Policy Name'
                });


            });

            afterEach(function () {

                sandbox.restore();
                fileUpLoadDialogToTest.onDestroy();

            });


            describe('showInstallFileDialog() test', function () {

                it("should create event handlers", function () {

                    expect(fileUpLoadDialogToTest.fileChangeEvent).not.to.be.defined;
                    expect(fileUpLoadDialogToTest.nameChangeEvent).not.to.be.defined;

                    fileUpLoadDialogToTest.showInstallFileDialog();

                    expect(fileUpLoadDialogToTest.fileChangeEvent).to.be.defined;
                    expect(fileUpLoadDialogToTest.nameChangeEvent).to.be.defined;
                });

            });

            describe('cleanUpOnCloseAction() test', function () {

                it("should remove event handlers", function () {

                    expect(fileUpLoadDialogToTest.fileChangeEvent).to.be.defined;
                    expect(fileUpLoadDialogToTest.nameChangeEvent).to.be.defined;


                    fileUpLoadDialogToTest.cleanUpOnCloseAction();

                    expect(fileUpLoadDialogToTest.fileChangeEvent).not.to.be.defined;
                    expect(fileUpLoadDialogToTest.nameChangeEvent).not.to.be.defined;

                });

            });


            describe('isNameValid() tests', function () {

                it("should always be valid if name field is hidden", function () {

                    fileUpLoadDialogToTest.hideNameField = true;
                    fileUpLoadDialogToTest.getNameTextField().setValue("");

                    expect(fileUpLoadDialogToTest.isNameValid()).to.equal(true);

                });

                it("should always be valid if name field populated", function () {

                    fileUpLoadDialogToTest.hideNameField = false;
                    fileUpLoadDialogToTest.getNameTextField().setValue("populated");

                    expect(fileUpLoadDialogToTest.isNameValid()).to.equal(true);

                });

                it("should be invalid if name field empty", function () {

                    fileUpLoadDialogToTest.hideNameField = false;
                    fileUpLoadDialogToTest.getNameTextField().setValue("");

                    expect(fileUpLoadDialogToTest.isNameValid()).to.equal(false);

                });

            });


            describe('addNameFieldChangeHandler() test', function () {

                it("#setDialogButtonsInstallEnabled is called on input event to fields ", function () {

                    sandbox.stub(fileUpLoadDialogToTest, 'setDialogButtonsInstallEnabled');

                    fileUpLoadDialogToTest.showInstallFileDialog(); // to add action listeners

                    var event = document.createEvent('Event');
                    event.initEvent('input', true, true);

                    fileUpLoadDialogToTest.getNameTextField().getNative().dispatchEvent(event);

                    expect(fileUpLoadDialogToTest.setDialogButtonsInstallEnabled.callCount).to.equal(2);

                });

            });

            describe('addFileSelectionChangeHandler() test', function () {

                it("#setDialogButtonsInstallEnabled is called on change event to fields ", function () {

                    sandbox.stub(fileUpLoadDialogToTest, 'setDialogButtonsInstallEnabled');

                    fileUpLoadDialogToTest.showInstallFileDialog(); // to add action listeners

                    var event = document.createEvent('Event');
                    event.initEvent('change', true, true);

                    fileUpLoadDialogToTest.getFileField().getNative().dispatchEvent(event);

                    expect(fileUpLoadDialogToTest.setDialogButtonsInstallEnabled.callCount).to.equal(2);

                });

            });


            describe('sendServerCallToInstall() test', function () {

                it("#sendServerCallToInstall sends server call with correct parameters", function () {


                    sandbox.stub(fileUpLoadDialogToTest, 'setDialogButtonsInstallEnabled');

                    fileUpLoadDialogToTest.fileSelected = {
                        name: "file name"
                    };

                    fileUpLoadDialogToTest.sendServerCallToInstall();

                    expect(net.ajax.getCall(0).calledWithMatch({
                        contentType: false,
                        processData: false,
                        type: 'POST',
                        url: "/onboarding/eso/v1.0/service-models"

                    })).to.equal(true);
                });

            });

            describe('handleInstallActionSuccess() test', function () {

                it("Calls to handle refresh with a toast", function () {

                    sandbox.stub(fileUpLoadDialogToTest, 'handleRefresh');


                    fileUpLoadDialogToTest.showInstallFileDialog();  // to have a parentDialog

                    fileUpLoadDialogToTest.handleInstallActionSuccess();

                    expect(fileUpLoadDialogToTest.handleRefresh.getCall(0).args[0]).to.equal("Install file request accepted");
                });

            });


            describe('handleInstallActionError() test', function () {

                it("Shows a regular error inline message for a 500 error", function () {

                    sandbox.stub(fileUpLoadDialogToTest, 'showInlineMessage');

                    var response = {
                        getStatus: function () {
                            return 500;
                        }
                    };

                    fileUpLoadDialogToTest.handleInstallActionError('model', response);

                    expect(fileUpLoadDialogToTest.showInlineMessage.getCall(0).calledWithMatch(

                        {options: {
                            description: "The server encountered an internal error. Please try again later or contact your System Administrator.",
                            header: "Unable to Retrieve Data",
                            icon: {name :'error'}

                        }})).to.equal(true);
                });

            });


        });

    });

});
