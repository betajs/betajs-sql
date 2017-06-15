# betajs-sql 1.0.3
[![Code Climate](https://codeclimate.com/github/betajs/betajs-sql/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-sql)
[![NPM](https://img.shields.io/npm/v/betajs-sql.svg?style=flat)](https://www.npmjs.com/package/betajs-sql)


BetaJS-SQL is a sql wrapper for BetaJS.



## Getting Started


You can use the library in your NodeJS project and compile it as well.

#### NodeJS

```javascript
	var BetaJS = require('betajs');
	require('betajs-data');
	require('betajs-sql');
```


#### Compile

```javascript
	git clone https://github.com/betajs/betajs-sql.git
	npm install
	grunt
```



## Basic Usage


The module contains the following subsystems:
- Database Access and Database Store with Support for Postgres SQL.


```javascript
	var sqldb = new BetaJS.Data.Databases.SqlDatabase({
    	user: "user",
    	database: "db",
    	password: "pass",
    	port: "5432",
    	host: "localhost"
    });
    var store = new BetaJS.Data.Stores.SqlDatabaseStore(sqldb, "table");
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


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Main Contributors

- Pablo Iglesias

## License

Apache-2.0







