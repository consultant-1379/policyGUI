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
 * Date: 27/02/18
 */
define([
    'jscore/ext/net',
    "eso-commonlib/NetAjaxInterceptor",
    'eso-commonlib/DialogUtils'
], function (coreNet, netAjaxInterceptor, DialogUtils) {
    'use strict';

    var sandbox, callOptions;

    describe('NetAjaxInterceptor Test', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            sandbox.spy(DialogUtils, 'showFullScreenErrorMessage');
            sandbox.stub(DialogUtils, 'alert');

            callOptions = {

                url: "test",
                type: "GET",
                dataType: 'json',
                success: function () {
                },
                error: function () {
                        // regular error handler
                }};




        });

        afterEach(function () {

            sandbox.restore();

        });

        it("should be defined", function () {
            expect(netAjaxInterceptor).to.be.defined;
        });

        describe("NetAjaxInterceptor Tests", function () {


            describe('#ajax tests', function () {


                it("should show full screen message when no licence status code received", function () {


                    sandbox.stub(coreNet, 'ajax').yieldsTo('error',
                        403,
                        {
                            getStatus: function () {
                                return 403;
                            }
                        }


                    );

                    netAjaxInterceptor.ajax(callOptions);

                    var expectedHeader =  "Valid License Required";
                    var expectedContent =  "<p>A valid license is required for this application. </p><p>Contact your System Administrator to activate this application " +
                    		               "or return to the <a href=''>Application Launcher</a></p>.";


                    expect((DialogUtils.showFullScreenErrorMessage.getCall(0).args[0])).to.equal(expectedHeader);
                    expect((DialogUtils.showFullScreenErrorMessage.getCall(0).args[1])).to.equal(expectedContent);

                });

                it("should not show a full screen message when not a full screen status code message", function () {


                    sandbox.stub(coreNet, 'ajax').yieldsTo('error',
                        404,
                        {
                            getStatus: function () {
                                return 404;
                            }
                        }

                    );

                    netAjaxInterceptor.ajax(callOptions);

                    expect(DialogUtils.showFullScreenErrorMessage.callCount).to.equal(0);


                });


            });

        });

    });


});

