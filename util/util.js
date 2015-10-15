var crypto = require('crypto');
var nconf = require('nconf');

module.exports = function(){
	
	var encryptPassword = function(password) {
	    var shaSum = crypto.createHash('sha256');
		//“salt” the hash by adding a secret key in front of the password before encrypting it. Saves from dictionary attack
		password=nconf.get('passwordSalt')+password;
		// Encrypting the salted password
		shaSum.update(password);
		return shaSum.digest('hex');
	};
	

	// Add more util functions here ......


	return {
		encryptPassword: encryptPassword
		// return more exceptions here
	}
}