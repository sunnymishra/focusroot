var UserDAO = require('../database/UserDAO.js').UserDAO;
var DatabaseError = require('../exception/CustomException.js').CustomException.databaseError;
var Util = require('../util/util.js');
var dateFormat = require('dateformat');
var Util = Util();

UserModel = function() {
};


UserModel.register = function(user, callback) {
	
	user.password=Util.encryptPassword(user.password);
	//user.created_date=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	user.created_date=new Date();
	console.log('Registering ' + user.email);

	var registerCallback = function(error, obj) {
		if (error) {
		  	callback(error); 
		} else {
	       callback(error, {"userId":obj.insertId});
	    }
	};

	UserDAO.create(user, registerCallback);

	console.log('Create command is sent. Exiting UserModel.register');
}



UserModel.createNewUser = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
        if (err) {
        	console.log('database connectivity error'+ err);
	      	if(connection) connection.release();
        	callback(err);
	    	
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query('Insert into user SET ?', User, function(err, result){
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

exports.UserModel = UserModel;
