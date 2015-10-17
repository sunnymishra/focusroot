var connectionPool = require('../database/databaseDriver.js').DatabaseDriver.connectionPool;


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


UserDAO.findByEmail = function(email, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    console.log('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT userId from F_USER Where email = ? and active = ? ", [email, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
					console.log('Email matched !');
					callback(err, true, rows[0].userId);
				}else{
					callback(err, false);
					console.log('Email didn\'t matched !');
				}
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

UserDAO.updatePassword = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
        if (err) {
        	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
        	callback(err);
        }

        console.log('connected as id ' + connection.threadId);
        
        connection.query('Update F_USER SET password = ?, modifiedDate = ? where userId = ?', [user.password, user.modifiedDate, user.userId], function(err, result){
            connection.release();
            if(!err) {
            	console.log('result.updatedRecords:', result.affectedRows);
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

UserDAO.authenticate = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    console.log('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT * from F_USER Where email = ? and password = ? and active = ? ", [user.email, user.password, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
					console.log('Authentication success !');
					callback(err, true, rows[0]);
				}else{
					callback(err, false);
					console.log('Wrong email or password !');
				}
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
