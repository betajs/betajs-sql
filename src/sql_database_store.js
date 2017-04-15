Scoped.define("server:Stores.SqlDatabaseStore", [
    "data:Stores.TransformationStore",
    "base:Objs",
    "server:Stores.DatabaseStore"
], function(TransformationStore, Objs, DatabaseStore, scoped) {
    return TransformationStore.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(database, table_name, types, foreign_id) {
                var store = new DatabaseStore(database, table_name, foreign_id);
                this.__store = store;
                inherited.constructor.call(this, store);
            },

            table: function() {
                return this.store().table();
            },

            store: function() {
                return this.__store;
            },

            _encodeSort: function(data) {
                var result = {};
                Objs.iter(data, function(value, key) {
                    if (key === "id")
                        key = "_id";
                    result[key] = value;
                });
                return result;
            },

            _encodeData: function(data) {
                return data;
            },

            _decodeData: function(data) {
                return data;
            },

            _update: function(updateData, queryData) {
                return this.table().updateByData(updateData, queryData);
            },

            _remove: function(removeData) {
                return this.table().removeByData(removeData);
            }

        };
    });
});