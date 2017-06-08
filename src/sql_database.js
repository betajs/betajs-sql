Scoped.define("module:Databases.SqlDatabase", [
    "data:Databases.Database",
    "data:Databases.SqlDatabaseTable",
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
                    this.__dbUri = Strings.strip_start(db, "mssql://");
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
                    var sqldb = new sqldbman(this.__dbObject);
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
            }
        };

    }, {

        uriToObject: function(uri) {
            var parsed = Uri.parse(uri);
            return {
                database: Strings.strip_start(parsed.path, "/"),
                host: parsed.host,
                port: parsed.port,
                username: parsed.user,
                password: parsed.password
            };
        },

        objectToUri: function(object) {
            object.path = object.database;
            return Uri.build(object);
        }

    });
});