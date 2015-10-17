var express = require('express');
var router = express.Router();
var UserService = require('../service/UserService.js').UserService;


router.post('/register', function(req, res) {
  console.log('Inside /register router');
	var user = req.body;
	var registerCallback = function(error, result) {
		if (error) {
    	  	res.status(409).send(error);
    	} else {
        	res.json({"userId":result});
        }
   	};
   	
	UserService.register(user, registerCallback);
  console.log('exiting from /register router');
});

router.get('/isUserExist/:email', function(req, res, next) {
  console.log('Inside /findByEmail router');
  var user = req.body;
  var findByEmailCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send(result);
        }
    };

  UserService.isUserExist(req.params.email, findByEmailCallback);
  console.log('exiting from /findByEmail router');

});


router.post('/forgotpassword', function(req, res) {
  console.log('Inside /forgotpassword router');
  var user = req.body;
  var forgotPasswordCallback = function(error, isSuccess) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send();
        }
    };
    
  UserService.forgotPassword(user, forgotPasswordCallback);
  console.log('Exiting from /forgotpassword router');
});


router.put('/update', function(req, res) {
	var user = req.body;
	connectionPool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('connected as id ' + connection.threadId);
        
        connection.query('Update user SET Name=?, Class=? Where user_ID = ?', [user.name, user.class, user.id], function(err, result){
            connection.release();
            if(!err) {
            	console.log('Last insert record:', result);
            	res.type('application/json');
            	
                res.json({"changedRowCount":result.changedRows});
            } else
	    		console.log('Error while performing Query.');          
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  	});
});

router.delete('/delete/:id', function(req, res) {
	var user = req.body;
	connectionPool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('connected as id ' + connection.threadId);
        
        connection.query('Delete user where user_ID = ?', [user.id], function(err, result){
            connection.release();
            if(!err) {
            	console.log('Last deleted record:', result);
            	res.type('application/json');
            	
                res.json({"deletedRowCount":result.affectedRows});
            } else
	    		console.log('Error while performing Query.');
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  	});
});


module.exports = router;


