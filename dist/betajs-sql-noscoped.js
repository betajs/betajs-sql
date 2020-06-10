/*!
betajs-sql - v1.0.5 - 2020-06-10
Copyright (c) Pablo Iglesias
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Data.Databases.Sql');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('data', 'global:BetaJS.Data');
Scoped.define("module:", function () {
	return {
    "guid": "4631f510-61c4-4a38-8065-c8e57577625b",
    "version": "1.0.5",
    "datetime": 1591797144372
};
});
Scoped.assumeVersion('base:version', 'undefined');
Scoped.assumeVersion('data:version', 'undefined');
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
Scoped.define("module:SqlDatabase", [
    "data:Databases.Database",
    "module:SqlDatabaseTable",
    "base:Strings",
    "base:Types",
    "base:Objs",
    "base:Promise",
    "base:Net.Uri"
], function(Database, SqlDatabaseTable, Strings, Types, Objs, Promise, Uri, scoped) {
    return Database.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(db) {
                if (Types.is_string(db)) {
                    this.__dbUri = db.substring(db.indexOf("://") + 3, db.length); //3 is the length of ://
                    this.__dbObject = this.cls.uriToObject(db);
                } else {
                    db = Objs.extend({
                        database: "database",
                        server: "localhost"
                    }, db);
                    this.__dbObject = db;
                    this.__dbUri = this.cls.objectToUri(db);
                }
                inherited.constructor.call(this);
                this.sql_module = require("node-redshift");
                this.sql_bricks = require("sql-bricks");
            },

            _tableClass: function() {
                return SqlDatabaseTable;
            },

            sqldb: function() {
                var ret = this.__sqldb;
                if (!this.__sqldb) {
                    var sqldbman = this.sql_module;
                    var sqldb = new sqldbman(this.__dbObject, {
                        rawConnection: true
                    });
                    this.__sqldb = sqldb;
                    ret = sqldb;
                }

                return ret;
            },

            sqldbMod: function() {
                return this.sql_module;
            },

            sqldbObj: function() {
                return this.__sqldb;
            },

            sqldbReqObj: function() {
                return this.__sqldbreq;
            },

            close: function() {
                this.__sqldb.close();
            }
        };

    }, {

        uriToObject: function(uri) {
            var parsed = Uri.parse(Strings.strip_start(uri, "jdbc:"));
            return {
                database: Strings.strip_start(parsed.path, "/"),
                host: parsed.host,
                port: parsed.port,
                user: (parsed.user) ? parsed.user : ((parsed.queryKey.user) ? parsed.queryKey.user : null),
                password: (parsed.password) ? parsed.password : ((parsed.queryKey.password) ? parsed.queryKey.password : null)
            };
        },

        objectToUri: function(object) {
            object.path = object.database;
            return Uri.build(object);
        }

    });
});
}).call(Scoped);