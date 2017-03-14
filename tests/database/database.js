test("sql database store", function () {
	/* QUnit Global Promise Polyfill doesn't like MongoDB Global Promise Polyfill. Ugh. */
	var PromiseBackup = global.Promise;
	delete global.PromiseBackup;
	/* QUnit Global Promise Polyfill doesn't like MongoDB Global Promise Polyfill. Ugh. */

	var sqldb = new BetaJS.Server.Databases.SqlDatabase("mssql://SA:Lalala23@localhost/tests");
	var store = new BetaJS.Server.Stores.SqlDatabaseStore(sqldb, "tests");
	store.insert({x: 5}).success(function (object) {
		ok(!!object.id);
		QUnit.equal(typeof object.id, "string");
		QUnit.equal(object.x, 5);
		store.update(object.id, {
			y: 7
		}).success(function (row) {
			QUnit.equal(row.y, 7);
			QUnit.equal(this.z, 3);
			store.get(object.id).success(function (obj) {
				start();
				/* QUnit Global Promise Polyfill doesn't like MongoDB Global Promise Polyfill. Ugh. */
				global.Promise = backup;
				/* QUnit Global Promise Polyfill doesn't like MongoDB Global Promise Polyfill. Ugh. */
			});
		}, {z: 3});
	});
	stop();
});