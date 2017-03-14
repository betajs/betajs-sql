/*!
betajs-sql - v1.0.0 - 2017-03-14
Copyright (c) Pablo Iglesias
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Server.Sql');
Scoped.binding('server', 'global:BetaJS.Server');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('data', 'global:BetaJS.Data');
Scoped.define("module:", function () {
	return {
    "guid": "9955100d-6a88-451f-9a85-004523eb8589",
    "version": "1.0.0"
};
});
Scoped.assumeVersion('base:version', 'undefined');
Scoped.assumeVersion('data:version', 'undefined');
Scoped.define("server:Stores.SqlDatabaseStore", [
	"data:Stores.TransformationStore",
	"base:Objs",
	"server:Stores.DatabaseStore"
], function (TransformationStore, Objs, DatabaseStore, scoped) {
	return TransformationStore.extend({scoped: scoped}, function (inherited) {
		return {

			constructor: function (database, table_name, types, foreign_id) {
				var store = new DatabaseStore(database, table_name, foreign_id);
				inherited.constructor.call(this, store);
			},

			table: function () {
				return this.store().table();
			},

			_encodeSort: function (data) {
				var result = {};
				Objs.iter(data, function (value, key) {
					if (key === "id")
						key = "_id";
					result[key] = value;
				});
				return result;
			},

			_encodeData: function (data) {
				return data;
			},

			_decodeData: function (data) {
				return data;
			}

		};
	});
});

Scoped.define("server:Databases.SqlDatabaseTable", [
        "server:Databases.DatabaseTable",
        "base:Promise",
        "base:Objs",
        "base:Types",
        "base:Iterators.ArrayIterator"
    ], function (DatabaseTable, Promise, Objs, Types, ArrayIterator, scoped) {
    return DatabaseTable.extend({scoped: scoped}, {

	    table: function (table_id) {
		    if (table_id)
			    this._table_id = table_id;
		    if (this.__req)
			    return this.__req;
		    return this._database.sqldb().mapSuccess(function () {
			    this.__req = this._database.sqldbReqObj();
			    this.__sql = this._database.sqldbMod();
			    return this.__req;
		    }, this);
	    },

	    _encode: function (data) {
		    return data;
	    },

	    _decode: function (data) {
		    return data;
	    },

	    _find: function (baseQuery, options) {
		    return this.table().mapSuccess(function (req) {
			    var query = this.__formatFind(baseQuery, options);
			    return Promise.funcCallback(req, req.query, query).mapSuccess(function (result, op) {
				    return Promise.funcCallback(result, result.toArray).mapSuccess(function (cols) {
					    return new ArrayIterator(cols);
				    }, this);
			    }, this).mapError(function (err) {
				    return err;
			    });
		    }, this);
	    },

	    _insertRow: function (row) {
		    return this.table().mapSuccess(function (req) {
			    var query = this.__formatInsertRow(row);
			    return Promise.funcCallback(req, req.query, query).mapSuccess(function (record, result) {
				    return record[0];
			    }, this).mapError(function (err) {
				    return err;
			    });
		    }, this);
	    },

	    _removeRow: function (query, callbacks) {
		    return this.table().mapSuccess(function (table) {
			    return Promise.funcCallback(table, table.remove, query);
		    }, this);
	    },

	    _updateRow: function (query, row, callbacks) {
		    return this.table().mapSuccess(function (table) {
			    return Promise.funcCallback(table, table.update, query, {"$set" : row}).mapSuccess(function () {
				    return row;
			    });
		    }, this);
	    },

	    ensureIndex: function (key) {
		    var obj = {};
		    obj[key] = 1;
		    this.table().success(function (table) {
			    table.ensureIndex(Objs.objectBy(key, 1));
		    });
	    },

	    __tableName: function () {
		    return this._table_name;
	    },

	    __tableId: function () {
		    return this._table_id;
	    },

	    __formatInsertRow: function (rowObject) {
		    var req = this.__req;
		    var sql = this.__sql;
		    var columns = "";
		    var values = "";
		    Objs.iter(rowObject, function (value, key) {
			    columns = columns + key.toString() + ",";
			    values = values + "@" + key.toString() + ",";
			    req.input(key, sql.VarChar, value);
		    }, this);
		    this.__req = req;
		    return 'INSERT INTO ' + this.__tableName() + ' (' + columns.slice(0, -1) + ') OUTPUT INSERTED.* VALUES (' + values.slice(0, -1) + ');';

	    },

	    __formatFind: function (queryObj, options) {
		    options = options || {};
		    var query = 'SELECT * FROM ' + this.__tableName();
		    return query;

	    }
    });
});

Scoped.define("server:Databases.SqlDatabase", [
	"server:Databases.Database",
	"server:Databases.SqlDatabaseTable",
	"base:Strings",
	"base:Types",
	"base:Objs",
	"base:Promise",
	"base:Net.Uri"
], function (Database, SqlDatabaseTable, Strings, Types, Objs, Promise, Uri, scoped) {
	return Database.extend({scoped: scoped}, function (inherited) {
		return  {

			constructor : function(db) {
				if (Types.is_string(db)) {
					this.__dbUri = Strings.strip_start(db, "mssql://");
					this.__dbObject = this.cls.uriToObject(db);
				} else {
					db = Objs.extend({
						database : "database",
						server : "localhost"
					}, db);
					this.__dbObject = db;
					this.__dbUri = this.cls.objectToUri(db);
				}
				inherited.constructor.call(this);
				this.sql_module = require("mssql");
			},

			_tableClass : function() {
				return SqlDatabaseTable;
			},

			sqldb : function() {
				var ret = this.__sqldb;
				if (!this.__sqldb) {
					var sqldbman = this.sql_module;
					sqldbman.Promise = Promise;
					var prom = sqldbman.Promise.create();
					var sqldb = new sqldbman.Connection('mssql://' + this.__dbUri, prom.asyncCallbackFunc());
					ret = prom.success(function () {
						this.__sqldb = sqldb;
						this.__sqldbreq = new this.sql_module.Request(sqldb);
					}, this);
				}

				return ret;
			},

			sqldbMod: function () {
				return this.sql_module;
			},

			sqldbObj: function () {
				return this.__sqldb;
			},

			sqldbReqObj: function () {
				return this.__sqldbreq;
			}
		};

	}, {

		uriToObject : function(uri) {
			var parsed = Uri.parse(uri);
			return {
				database : Strings.strip_start(parsed.path, "/"),
				server : parsed.host,
				port : parsed.port,
				username : parsed.user,
				password : parsed.password
			};
		},

		objectToUri : function(object) {
			object.path = object.database;
			return Uri.build(object);
		}

	});
});
}).call(Scoped);