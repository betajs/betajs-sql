Scoped.define("module:SqlDatabaseTable", [
    "data:Databases.DatabaseTable",
    "base:Promise",
    "base:Objs",
    "base:Types",
    "base:Iterators.ArrayIterator"
], function(DatabaseTable, Promise, Objs, Types, ArrayIterator, scoped) {
    return DatabaseTable.extend({
        scoped: scoped
    }, {

        table: function(table_id) {
            this._table_id = table_id || "id";
            if (this.__req)
                return this.__req;
            this.__req = this._database.sqldb();
            this.__sqlbricks = this._database.sql_bricks;
            return this.__req;
        },

        primary_key: function() {
            return this._table_id;
        },

        _encode: function(data) {
            return data;
        },

        _decode: function(data) {
            return data;
        },

        _find: function(baseQuery, options) {
            var req = this.table();
            var query = this.__formatFind(baseQuery, options);
            var prom = Promise.create();
            return Promise.funcCallback(req, req.query, query, {}).mapSuccess(function(result) {
                return new ArrayIterator(result.rows);
            }, this).mapError(function(err) {
                return err;
            });
        },

        _insertRow: function(row) {
            var req = this.table();
            var query = this.__formatInsertRow(row);
            var prom = Promise.create();
            req.query(query, {}, prom.asyncCallbackFunc());
            return prom.success(function(result) {
                return result;
            }, this).error(function(result) {
                return result;
            }, this);
        },

        _removeRow: function(delParams) {
            var req = this.table();
            var query = this.__formatDelete(delParams);
            var prom = Promise.create();
            req.query(query, {}, prom.asyncCallbackFunc());
            return prom.success(function(result) {
                return result;
            }, this).error(function(result) {
                return result;
            }, this);
        },

        _updateRow: function(toUpdate, where) {
            var req = this.table();
            var query = this.__formatUpdate(toUpdate, where);
            var prom = Promise.create();
            req.query(query, {}, prom.asyncCallbackFunc());
            return prom.success(function(result) {
                return result;
            }, this).error(function(result) {
                return result;
            }, this);
        },

        ensureIndex: function(key) {
            var obj = {};
            obj[key] = 1;
            this.table().success(function(table) {
                table.ensureIndex(Objs.objectBy(key, 1));
            });
        },

        updateByData: function(updateData, queryData) {
            return this.updateRow(updateData, queryData);
        },

        removeByData: function(queryData) {
            return this.removeRow(queryData);
        },

        __tableName: function() {
            return this._table_name;
        },

        __tableId: function() {
            return this._table_id;
        },

        __formatInsertRow: function(rowObject) {
            var sql = this.__getFormatter();
            return sql.insert(this.__tableName(), rowObject).toParams();
        },

        __formatDelete: function(toDelete) {
            var sql = this.__getFormatter();
            var query = sql["delete"].apply(sql).from(this.__tableName());
            if (toDelete) {
                var where;
                if (Types.is_array(toDelete) || Types.is_object(toDelete)) {
                    query = this.__extractWhereParams(toDelete, query);
                }
            }

            return query.toParams();
        },

        __formatUpdate: function(toUpdate, queryObj) {
            var sql = this.__getFormatter();
            var query = sql.update(this.__tableName(), toUpdate);
            if (queryObj) {
                var where;
                if (Types.is_array(queryObj) || Types.is_object(queryObj)) {
                    query = this.__extractWhereParams(queryObj, query);
                }
            }

            return query.toParams();
        },

        __formatFind: function(queryObj, options) {
            options = options || {};
            var sql = this.__getFormatter();
            var query = sql.select().from(this.__tableName());
            if (options.distinct)
                query.distinct(options.distinct);
            if (options.columns)
                query.select(options.columns);
            if (queryObj) {
                var where;
                if (Types.is_array(queryObj) || Types.is_object(queryObj)) {
                    query = this.__extractWhereParams(queryObj, query);
                }
            }

            if (options.groupBy)
                query.groupBy(options.groupBy);
            if (options.orderBy)
                query.orderBy(options.orderBy);
            return query.toParams();
        },

        __extractWhereParams: function(queryObj, query) {
            Objs.iter(queryObj, function(obj, key) {
                if (Objs.contains_value(this.__specialWhereParams(), key)) {
                    query = this.__specialWhereParam(query, key, obj);
                } else {
                    if (Types.is_object(obj)) {
                        query.where(obj);
                    } else {
                        if (queryObj.hasOwnProperty(key)) {
                            var whereObj = {};
                            whereObj[key] = obj;
                            query.where(whereObj);
                        }
                    }
                }
            }, this);

            return query;
        },

        __specialWhereParam: function(query, key, obj) {
            var sql = this.__getFormatter();
            if (key == "or") {
                query.where(sql.or(obj));
            } else {
                if (Types.is_object(obj) && !Types.is_array(obj)) {
                    var keyW = Objs.keys(obj)[0];
                    var valueW = Objs.values(obj)[0];
                    query.where(sql[key](keyW, valueW));
                } else {
                    if (Types.is_array(obj)) {
                        Objs.iter(obj, function(objI, keyI) {
                            query = this.__specialWhereParam(query, key, objI);
                        }, this);
                    }
                }

            }
            return query;
        },

        __specialWhereParams: function() {
            return ["or", "eq", "notEq", "lt", "lte", "gt", "gte"];
        },

        __getFormatter: function() {
            return this.__sqlbricks;
        }
    });
});