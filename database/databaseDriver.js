var mysql = require('mysql');
var dbconfig = require('../resources/db.json');

DatabaseDriver = function() {
};

var datasource = {
  connectionLimit:dbconfig.dbconnectionLimit, //important
  host:dbconfig.dbhost,
  user:dbconfig.dbuser,
  password:dbconfig.dbpassword,
  database:dbconfig.dbdatabase,
  debug:dbconfig.dbdebug,
}

DatabaseDriver.connectionPool = mysql.createPool(datasource);


exports.DatabaseDriver = DatabaseDriver;
