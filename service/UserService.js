var UserDAO = require('../database/UserDAO.js').UserDAO;
var DatabaseError = require('../exception/CustomException.js').CustomException.databaseError;
var Util = require('../util/util.js');
var Util = Util();
var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
var nconf = require('nconf');

UserService = function() {
};


UserService.register = function(user, callback) {
	user.password=Util.encryptPassword(user.password);
	//user.created_date=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	user.createdDate=new Date();
	user.active=true;

	console.log('Registering ' + user.email);

	var registerCallback = function(error, obj) {
		if (error) {
		  	callback(error); 
		} else {
	       callback(error, {"userId":obj.insertId});
	    }
	};

	UserDAO.create(user, registerCallback);

	console.log('Create command is sent. Exiting UserService.register');
}

UserService.isUserExist = function(email, callback) {
	//user.created_date=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	console.log('isUserExist for email: ' + email);

/*	var mailConfig = {
		"mailhost": nconf.get('mailhost')
	};
*/
	var findByEmailCallback = function(error, isSuccess, userId) {
		if (error) {
		  	callback(error); 
		} else {
			if(isSuccess)
	       		callback(error, {"email.exist":true, "userId":userId});
	       	else
	       		callback(error, {"email.exist":false, "description":"Email doesn't exist"});
	    }
	};

	UserDAO.findByEmail(email, findByEmailCallback);

	console.log('isUserExist command is sent to DAO. Exiting UserService.isUserExist');
}


UserService.forgotPassword = function(user, callback) {
	user.modifiedDate=new Date();
	UserDAO.updatePassword(user, function(err, result){
		if (err) {
			console.log('Error during DB access');
			callback(err);
		} else {
			
			var smtpTransport = nodemailer.createTransport("SMTP", {
			    host: "smtp.gmail.com", // hostname
			    secureConnection: true, // use SSL
			    port: 465, // port for secure SMTP
			    auth: {
			        user: "sunny.leotechno@gmail.com",
			        pass: "unknowns"
			    }
			});
			

			smtpTransport.sendMail({
				from: 'sunny.leotechno@gmail.com',
				to: 'sunny.mishra0389@gmail.com',
				subject: 'Forgot password verification code',
				text: 'Please enter following verification code to activate your new app password:\n' + Util.verificationCode()
			}, function forgotPasswordResult(err) {
				if (err) {
					callback(err, false);
				} else {
					callback(err, true);
				}
			});
			;
		}
	});

}


exports.UserService = UserService;
