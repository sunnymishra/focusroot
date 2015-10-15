var mysql = require('mysql');

var connectionPool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
    user     : 'sunny',
  	password : 'sunny',
  	database : 'mydb',
    debug    :  false
});

exports.connectionPool = connectionPool;
