var Redshift = require('node-redshift');

var client = {
	user: "postgres",
	database: "postgres",
	password: "Popo",
	port: "5432",
	host: "localhost"
};

var redshiftClient = new Redshift(client);

var queryStr = "select * from films";
options = {raw: true}

// execute query and invoke callback...
redshiftClient.query(queryStr, options, myCallBack);

function myCallBack (error, result) {
	console.log ("Callback called....");
}