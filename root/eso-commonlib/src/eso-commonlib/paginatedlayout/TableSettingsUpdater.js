define([
    'i18n!eso-commonlib/dictionary.json',
    'eso-commonlib/StatusCell',
    'eso-commonlib/RawMessageCell'
], function(Dictionary,StatusCell, RawMessageCell) {

    var tableConfigStorageKey = ':ds-paginated-table:config';

    return {

        addHandlers : function(table, name) {
            table.addEventHandler('column:resize', function(resizedColumn,
                    columnsDef) {
                persistConfig(table.toJSON(), name);
            });

            table.addEventHandler('table:sort', function(sortDir, sortAttr) {
                persistConfig(table.toJSON(), name);
            });

            table.addEventHandler('table:settings', function(columnsDef) {
                persistConfig(table.toJSON(), name);
            });

            table.addEventHandler('table:filter', function(filters) {
                persistConfig(table.toJSON(), name);
            });

            table.addEventHandler('pageIndex:change', function(pageIndex) {
                persistConfig(table.toJSON(), name);
            });

            table.addEventHandler('pageSize:change', function(pageSize) {
                persistConfig(table.toJSON(), name);
            });
        },

        getSavedConfig: function(name) {
            // set on local storage for the example,
            // production application should store it server side
            var savedConfig = JSON.parse(sessionStorage.getItem(getConfigStorageKey(name)));

            if (savedConfig) {
                // function (cellType in this case) not persisted with stringify
                savedConfig.columns.forEach(function (col) {
                    if (col.title === Dictionary.columnTitles.RAW_MESSAGE) {
                        col.cellType = RawMessageCell;
                    } else if (col.attribute === 'status') {
                        col.cellType = StatusCell;
                    } else if (col.attribute === 'lastLogin') {
                        col.cellType = DateCell;
                    }
                });
            }
            return savedConfig;
        }
    };

    function persistConfig(config, name) {
        // set on local storage for the example,
        // production application should store it server side
       sessionStorage.setItem(getConfigStorageKey(name), JSON.stringify(config));
    }

    function getConfigStorageKey(name) {
        return name + tableConfigStorageKey;
    }
});
