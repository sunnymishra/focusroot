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


router.post('/login', function(req, res) {
  console.log('Inside /login router');
  var user = req.body;
  var loginCallback = function(error, response) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send(response);
        }
    };
    
  UserService.authenticate(user, loginCallback);
  console.log('Exiting from /login router');
});


module.exports = router;


