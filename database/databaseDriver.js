var mysql = require('mysql');
var nconf = require('nconf');

DatabaseDriver = function() {
};

DatabaseDriver.connectionPool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
    user     : 'sunny',
  	password : 'sunny',
  	database : 'mydb',
    debug    :  false
});

DatabaseDriver.test = function(){
    console.log('test DB json: ' + nconf.get('connectionLimit'));
    /*host     : nconf.get('host'),
    user     : nconf.get('user'),
  	password : nconf.get('password'),
  	database : nconf.get('database'),
    debug    : false*/
};


exports.DatabaseDriver = DatabaseDriver;
