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
	
	function verificationCode() {
		var high = 1, low = 9;
		var val="";
		for(i = 0 ; i < 6 ; i++){
			val += ""+Math.floor(random(high, low));
		}
	    return val;
	}

	function random (low, high) {
	    return Math.random() * (high - low) + low;
	}

	// Add more util functions here ......


	return {
		encryptPassword: encryptPassword,
		verificationCode: 	verificationCode
		// return more exceptions here
	}
}