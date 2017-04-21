The BetaJS Server module contains the following subsystems:
- Database Access and Database Store with Support for Postgres SQL.


```javascript
	var sqldb = new BetaJS.Server.Databases.SqlDatabase({
    	user: "user",
    	database: "db",
    	password: "pass",
    	port: "5432",
    	host: "localhost"
    });
    var store = new BetaJS.Server.Stores.SqlDatabaseStore(sqldb, "table");
    store.insert({"x" : 1}).mapSuccess(function (res) {
    	store.query({"x" : 1}, {"orderBy" : "id DESC"}).mapSuccess(function (res) {
    		var r = res.next();
    		store.update({"x" : "1"}, {"x" : 3}).mapSuccess(function (res) {
    			store.remove({"x": 3}).mapSuccess(function (res) {
    				var r = res;
    				console.log(res.next());
    			}, this).mapError(function (err) {
    				var e = err;
    				console.log(err);
    			}, this);
    		}, this).mapError(function (err) {
    			var e = err;
    			console.log(err);
    		}, this);
    	}, this).mapError(function (err) {
    		var e = err;
    		console.log(err);
    	}, this);
    }, this).mapError(function (err) {
    	var e = err;
    	console.log(err);
    }, this);
```
