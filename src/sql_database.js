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