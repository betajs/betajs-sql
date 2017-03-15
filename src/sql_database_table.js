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
		    this.__req = this._database.sqldb();
		    this.__sqlbricks = this._database.sql_bricks;
		    return this.__req;
	    },

	    _encode: function (data) {
		    return data;
	    },

	    _decode: function (data) {
		    return data;
	    },

	    _find: function (baseQuery, options) {
		    var req = this.table();
		    var query = this.__formatFind(baseQuery, options);
		    var prom = Promise.create();
		    return Promise.funcCallback(req, req.query, query, {}).mapSuccess(function (result) {
			    return new ArrayIterator(result.rows);
		    }, this).mapError(function (err) {
			    return err;
		    });
		    /* mapSuccess(function (result, op) {
		     return Promise.funcCallback(result, result.toArray).mapSuccess(function (cols) {
		     return new ArrayIterator(cols);
		     }, this);
		     }, this).mapError(function (err) {
		     return err;
		     });*/
	    },

	    _insertRow: function (row) {
		    var req = this.table();
		    var query = this.__formatInsertRow(row);
		    var prom = Promise.create();
		    req.query(query, {}, prom.asyncCallbackFunc());
		    return prom.success(function (result) {
			    return result;
		    }, this).error(function (result) {
			    return result;
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
		    var sql = this.__getFormatter();
		    return sql.insert(this.__tableName(), rowObject).toParams();
	    },

	    __formatFind: function (queryObj, options) {
		    options = options || {};
		    var columns = options.columns || "*";
		    var sql = this.__getFormatter();
		    var query = sql.select(columns).from(this.__tableName());
		    if (options.distinct)
			    query = sql.distinct(columns).from(this.__tableName());
		    if (queryObj)
			    query.where(queryObj);
		    return query.toParams();
	    },

	    __getFormatter: function () {
		    return this.__sqlbricks;
	    }
    });
});
