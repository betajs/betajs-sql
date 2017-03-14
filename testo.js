var BetaJS = require('betajs/dist/beta.js');
require('betajs-data/dist/betajs-data.js');
require('betajs-server/dist/betajs-server.js');
require('./dist/betajs-sql.js');

var sqldb = new BetaJS.Server.Databases.SqlDatabase({
	user: "postgres",
	database: "postgres",
	password: "Popo",
	port: "5432",
	host: "localhost"
});
//var store = new BetaJS.Server.Stores.SqlDatabaseStore(sqldb, "Persons", "ID");

sqldb.sqldb().mapSuccess(function () {
	var obj = sqldb.sqldbObj();
	var req = new sql.Request(obj);
	req.query('select * from films', function(err, recordset) {
		// ... error checks
		var lala = err;
		var lalo = recordset;
	});
});
/*
var asd = store.query().mapSuccess(function (result) {
	var cac = result;
});

var lala = "lala";
var lale = "lale";
var lali = "lali";
var lalo = "lalo";*/