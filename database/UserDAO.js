var connectionPool = require('../database/databaseDriver.js').connectionPool;

UserDAO = function() {
};

UserDAO.find = function(id, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    console.log('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT * from User Where userId = ? and active = ? ", [id, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	console.log('Fetched result:', rows);
	            callback(err, rows);
	        } else{
	        	console.log('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          console.log('Error in connection database. '+ err); 
	          callback(err);
	    });
	});
};

UserDAO.findByEmail = function(email, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    console.log('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT * from User Where email = ? and active = ? ", [email, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	console.log('Fetched result:', rows);
	            callback(err, rows);
	        } else{
	        	console.log('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          console.log('Error in connection database. '+ err); 
	          callback(err);
	    });
	});
};

UserDAO.create = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
        if (err) {
        	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
        	callback(err);
        }

        console.log('connected as id ' + connection.threadId);
        
        connection.query('Insert into F_USER SET ?', user, function(err, result){
            connection.release();
            if(!err) {
            	console.log('Last insert record:', result);
	            callback(err, result);
	        } else{
	        	console.log('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    	    
        });

        connection.on('error', function(err) {      
              console.log('Error in connection database. '+ err); 
	          callback(err);
        });
  	});
};

exports.UserDAO = UserDAO;
