/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2018
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied
 *******************************************************************************
 * User: EEICMSY
 * Date: 13/09/18
 */
define([
    "jscore/core",
    'jscore/ext/net',
    "eso-commonlib/paginatedlayout/BackgroundTableRefresher" ,
    "eso-commonlib/paginatedlayout/GeneralPaginatedLayoutTable"
],
    function (core, coreNet, BackgroundTableRefresher, GeneralPaginatedLayoutTable) {
        'use strict';

        var sandbox, paginatedLayoutTable, paginationOptions, backgroundTableRefresherToTest;

        describe('BackgroundTableRefresher tests ', function () {

            it("should not be undefined", function () {
                expect(BackgroundTableRefresher).not.to.be.undefined;
            });

            describe('BackgroundTableRefresher test methods', function () {
                beforeEach(function () {
                   sandbox = window.sinon.sandbox.create();

                   var columns = [

                       {
                           title: "colName1",
                           attribute: 'colAttribute1',
                           width: '200px',
                           sortable: true,
                           resizable: true
                       },
                       {
                           title: 'colName2',
                           attribute: 'colAttribute2',
                           width: '250px',
                           sortable: true,
                           resizable: true
                       }
                   ];

                   var filter = {};
                   filter.id = "5";

                   paginationOptions = {
                           columns: columns,
                           header: "UnitTest",
                           url: '/policynbi/sd/v1.0/policy/grid',
                           getAllIdsURL: '/policynbi/sd/v1.0/policy/grid/allIds',
                           preFilterJSON: JSON.stringify(filter),
                           filterFormClass: {},
                           paginatedLayoutRowSelectionHandler: function () {
                               return{
                                   handleGridPopulation: function (/*rowCount*/) {

                                   },
                                   selectAllOnAllPages: function () {
                                   },
                                   selectChange: function () {
                                   }
                               };
                           }.bind(this),
                           showEmptyGridMessage: function (isShow) {
                           },
                           onErrorHandler: function () {
                           },
                           getCurrentContextActions: function () {
                           },

                           showFilteringOptions: true,
                           showSortingOptions: true
                       };

                       paginatedLayoutTable = new GeneralPaginatedLayoutTable(paginationOptions);

                       sandbox.stub(paginatedLayoutTable, "getSelectedIds", function () {
                           return [];

                       });

                       paginatedLayoutTable.onViewReady();


                       backgroundTableRefresherToTest = new BackgroundTableRefresher({
                               getPaginatedTable: function () {
                                   return  paginatedLayoutTable;
                               },
                               onErrorHandler: function () {},
                               setPreRefreshSelectedIds: function () {}
                      });

                });

                afterEach(function () {
                    sandbox.restore();
                    paginatedLayoutTable.onDestroy();

                });

                it("silentRefresh should caches server response  (rows) ", function () {

                    var getItemsURL = "test",
                    getAllIdsURL = "ids",
                    urlQueryParams = {'fetchChild': true};

                    sandbox.stub(coreNet, 'ajax').yieldsTo('success',
                            {items: [
                                {id: "1", colAttribute1: "hello"},
                                {id: "2", colAttribute1: "hello2"}
                            ], total: 2}, // ok always row reposnse in test
                            {
                                getStatus: function () {
                                    return 200;
                                }
                           });
                    backgroundTableRefresherToTest.silentRefresh(getItemsURL, getAllIdsURL, urlQueryParams);

                    expect(backgroundTableRefresherToTest.getRowData()).to.deep.equal({items: [
                        {id: "1", colAttribute1: "hello"},
                        {id: "2", colAttribute1: "hello2"}
                    ], total: 2});

                    expect(backgroundTableRefresherToTest.hasReadyData()).to.equal(true);

                });

                it("silentRefresh should cache server response  (ids) ", function () {


                    sandbox.stub(coreNet, 'ajax').yieldsTo('success',
                        ["1", "2", "3", "4"], // ok always row response in test
                        {
                            getStatus: function () {

                                return 200;
                            }
                        }


                    );

                    var getItemsURL = "test",
                        getAllIdsURL = "ids",
                        urlQueryParams = {'fetchChild': true};

                    backgroundTableRefresherToTest.silentRefresh(getItemsURL, getAllIdsURL, urlQueryParams);

                    expect(backgroundTableRefresherToTest.getAllIds()).to.deep.equal(["1", "2", "3", "4"]);

                    expect(backgroundTableRefresherToTest.hasReadyData()).to.equal(true);

                });

                it("handleParallelError call should clear cached data ", function () {


                    sandbox.stub(coreNet, 'ajax').yieldsTo('success',
                        ["1", "2", "3", "4"], // ok always row response in test
                        {
                            getStatus: function () {

                                return 200;
                            }
                        }


                    );

                    var getItemsURL = "test",
                        getAllIdsURL = "ids",
                        urlQueryParams = {'fetchChild': true};

                    backgroundTableRefresherToTest.silentRefresh(getItemsURL, getAllIdsURL, urlQueryParams);

                    expect(backgroundTableRefresherToTest.getAllIds()).to.deep.equal(["1", "2", "3", "4"]);

                    expect(backgroundTableRefresherToTest.hasReadyData()).to.equal(true);


                    backgroundTableRefresherToTest.handleParallelError();

                    expect(backgroundTableRefresherToTest.hasReadyData()).to.equal(false);

                });

            });

        });
});
