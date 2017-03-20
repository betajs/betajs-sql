# betajs-sql 1.0.0
[![Code Climate](https://codeclimate.com/github/betajs/betajs-sql/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-sql)


BetaJS-SQL is a sql wrapper for BetaJS.



## Getting Started


You can use the library in your NodeJS project and compile it as well.

#### NodeJS

```javascript
	var BetaJS = require('betajs/dist/beta.js');
    require('betajs-data/dist/betajs-data.js');
    require('betajs-server/dist/betajs-server.js');
    require('./dist/betajs-sql.js');
```


#### Compile

```javascript
	git clone https://github.com/betajs/betajs-sql.git
	npm install
	grunt
```



## Basic Usage


The BetaJS SQL module contains the following subsystems:
- Database Access and Database Store with support for PostgreSQL and RedShift SQL


```javascript
	var sqldb = new BetaJS.Server.Databases.SqlDatabase({
    	user: "db-user",
    	database: "db",
    	password: "db-pass",
    	port: "db-port",
    	host: "db-host"
    });
    var store = new BetaJS.Server.Stores.SqlDatabaseStore(sqldb, "table");
    store.insert({"col_1" : 1234, "col_2" : "val_2", "col_3" : 123, "col_4" : "val_4", "col_5" : "val_5"}).mapSuccess(function (res) {
    	store.query({"col_1" : 1}, {"orderBy" : "id DESC"}).mapSuccess(function (res) { //First param the "where" options, second param the sorting and filter options 
    		var r = res.next();
    		store.update({"countrycode" : "ARG"}, {"id" : r.id}).mapSuccess(function (res) {
    			store.remove({"population": 1, "countrycode" : "ARG"}).mapSuccess(function (res) {

    			}).mapError(function (err) {
    				console.log(err);
    			});
    		}).mapError(function (err) {
    			console.log(err);
    		});
    	}).mapError(function (err) {
    		console.log(err);
    	});
    }).mapError(function (err) {
    	console.log(err);
    });
```



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [http://betajs.com](http://betajs.com) |
| Git        | [git://github.com/betajs/betajs-sql.git](git://github.com/betajs/betajs-sql.git) |
| Repository | [https://github.com/betajs/betajs-sql](https://github.com/betajs/betajs-sql) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 
 



## Compatability
| Target | Versions |
| :----- | -------: |
| NodeJS | 0.10 - Latest |


## CDN
| Resource | URL |
| :----- | -------: |
| betajs-sql.js | [http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql.js](http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql.js) |
| betajs-sql.min.js | [http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql.min.js](http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql.min.js) |
| betajs-sql-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql-noscoped.js](http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql-noscoped.js) |
| betajs-sql-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-sql/master/dist/betajs-sql-noscoped.min.js) |



## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-data | [Open](https://github.com/betajs/betajs-data) |
| betajs-server | [Open](https://github.com/betajs/betajs-server) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Main Contributors

- Pablo Iglesias

## License

Apache-2.0







