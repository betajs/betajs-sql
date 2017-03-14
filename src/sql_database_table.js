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
