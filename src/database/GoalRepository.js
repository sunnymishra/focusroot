var connectionPool = require('../util/databaseDriver.js').DatabaseDriver.connectionPool;
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
	    	"SELECT g.*, ug.userGoalId, ug.goalStartDate, ug.goalEndDate, ug.goalProgressPercent, ug.isGoalAchieved from F_GOAL AS g "+
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

GoalRepository.fetchTaglist = function(callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT tagId, tagName from F_TAG "+
	    	"where active = ? ";
	    connection.query(sql, [1], function(err, rows, fields){
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


GoalRepository.createGoal = function(goal, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    log.debug('Inserting goal: ' + JSON.stringify(goal));
	    connection.query('Insert into F_GOAL SET ?', goal, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null, result);
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

GoalRepository.createUserGoalMap = function(goalDetails, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Insert into F_USER_GOAL SET ?', goalDetails, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null, result);
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

GoalRepository.createGoalLog = function(goalLogDetails, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Insert into F_GOAL_TRACKER SET ?', goalLogDetails, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null);
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

GoalRepository.find = function(goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Select * from F_GOAL where goalId=? and active=?', [goalId, 1], function(err, rows){
            connection.release();
            if(!err) {
	        	log.debug('Fetched result:', rows[0]);
	            callback(null, rows[0]);
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

GoalRepository.updateGoalProgressPercent = function(obj, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 'Update F_USER_GOAL SET goalProgressPercent = ?, modifiedDate = ? where userGoalId = ?';
	    connection.query(sql, [obj.goalProgressPercent, obj.modifiedDate, obj.userGoalId], function(err, result){
	        connection.release();
	        if(!err) {
	        	log.debug('result.updatedRecords: %s', result.affectedRows);
	            callback(null, result);
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


GoalRepository.fetchGoal = function(userGoalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.goalId, g.tagId, g.goalTypeId, g.goalName, g.goalDescription, g.goalTargetValue, g.goalUnit, "+
			"ug.userGoalId, ug.goalProgressPercent, ug.goalStartDate, ug.goalEndDate, ug.isGoalAchieved "+
			"from F_GOAL g JOIN F_USER_GOAL ug ON g.goalId=ug.goalId "+
	    	"where ug.userGoalId=? and ug.active = ? and g.active = ? ";
	    connection.query(sql, [userGoalId, 1, 1], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows[0]);
		            callback(null, true, rows[0]);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist !', userGoalId);
				}
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


GoalRepository.fetchGoalTracker = function(userGoalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT logValue, logUnit, logNotes, logDate "+
			"from F_GOAL_TRACKER where userGoalId=? ";
	    connection.query(sql, [userGoalId], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows);
		            callback(null, true, rows);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist in F_GOAL_TRACKER table !', userGoalId);
				}
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


GoalRepository.fetchGoalList = function(tagId, goalTypeId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.goalId, g.tagId, g.goalTypeId, g.goalName, g.goalDescription "+
	    	"from f_goal g "+
	    	"where g.tagId = ? AND g.goalTypeId = ? AND g.active = ? AND g.isPrivateGoal = ? ";

	    connection.query(sql, [tagId, goalTypeId, 1, 0], function(err, rows, fields){
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
