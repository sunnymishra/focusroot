var connectionPool = require('../database/databaseDriver.js').DatabaseDriver.connectionPool;
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));

GoalRepository = function() {
};

GoalRepository.fetchMyGoalList = function(userId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.*, ug.goalProgressPercent from F_GOAL AS g "+
	    	"INNER JOIN F_USER_GOAL AS ug ON g.goalId=ug.goalId "+
	    	"where ug.userId = ? AND g.active = ? AND ug.active = ? ";
	    connection.query(sql, [userId, userId, 1, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


exports.GoalRepository = GoalRepository;
