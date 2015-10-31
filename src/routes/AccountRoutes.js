var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var AccountService = require('../service/AccountService.js').AccountService;

router.post('/register', function(req, res) {
  log.debug('Inside /register router');
	var user = req.body;
	var registerCallback = function(error, result) {
		if (error) {
    	  	res.status(409).send(error);
    	} else {
        	res.json({"userId":result});
        }
   	};
   	
	AccountService.register(user, registerCallback);
  log.debug('exiting from /register router');
});

router.post('/login', function(req, res) {
  log.debug('Inside /login router');
  var user = req.body;
  var loginCallback = function(error, response) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send(response);
        }
    };
    
  AccountService.authenticate(user, loginCallback);
  log.debug('Exiting from /login router');
});

router.get('/isAccountExist/:email', function(req, res, next) {
  log.debug('Inside /findByEmail router');
  var user = req.body;
  var findByEmailCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send(result);
        }
    };

  AccountService.isAccountExist(req.params.email, findByEmailCallback);
  log.debug('exiting from /findByEmail router');

});


router.post('/forgotpassword', function(req, res) {
  log.debug('Inside /forgotpassword router');
  var user = req.body;
  var forgotPasswordCallback = function(error, isSuccess) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send();
      }
  };
    
  AccountService.forgotPassword(user, forgotPasswordCallback);
  log.debug('Exiting from /forgotpassword router');
});

router.post('/verifypasswordcode', function(req, res) {
  log.debug('Inside /verifypasswordcode router');
  var user = req.body;
  var verifyForgotPasswordCodeCallback = function(error, response) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.status(200).send(response);
      }
  };
  AccountService.verifyForgotPasswordCode(user, verifyForgotPasswordCodeCallback);
  log.debug('Exiting from /verifypasswordcode router'); 
});



module.exports = router;


