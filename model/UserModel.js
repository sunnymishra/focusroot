var UserDAO = require('../database/UserDAO.js').UserDAO;
var DatabaseError = require('../exception/CustomException.js').CustomException.databaseError;
var Util = require('../util/util.js');
var Util = Util();
var dateFormat = require('dateformat');


UserModel = function() {
};


UserModel.register = function(user, callback) {
	
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

	console.log('Create command is sent. Exiting UserModel.register');
}



UserModel.forgotPassword = function(email, callback) {
	UserDAO.findByEmail(email, function findAccount(err, user){
		if (err) {
			// Email address is not a valid user
			callback(false);
		} else {
			var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
			resetPasswordUrl += '?account=' + doc._id;
			smtpTransport.sendMail({
				from: 'thisapp@example.com',
				to: doc.email,
				subject: 'SocialNet Password Request',
				text: 'Click here to reset your password: ' + resetPasswordUrl
			}, function forgotPasswordResult(err) {
				if (err) {
					callback(false);
				} else {
					callback(true);
				}
			});
		}
	});

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






exports.UserModel = UserModel;
