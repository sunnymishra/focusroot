var GoalRepository = require('../database/GoalRepository.js').GoalRepository;
var UserRepository = require('../database/UserRepository.js').UserRepository;
var nconf = require('nconf');
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var dateFormat = require('dateFormat');

GoalService = function() { 
};


GoalService.fetchMyGoalList = function(userId, callback) {
	log.debug('Fetching Goals for UserId' + userId);

	var serviceCallback = function(error, result) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch list due to unexpected error. Please try again."}); 
		} else {
			if(result){
				result.forEach( function (goal)
				{
				    goal.createdDate=goal.createdDate?dateFormat(goal.createdDate, nconf.get('myDateFormat')):null;
				    goal.goalStartDate=goal.goalStartDate?dateFormat(goal.goalStartDate, nconf.get('myDateFormat')):null;
				    goal.goalEndDate=goal.goalEndDate?dateFormat(goal.goalEndDate, nconf.get('myDateFormat')):null;
				});
			}
	       callback(null, {"success":true, "myGoalList":result});
	    }
	};

	GoalRepository.fetchMyGoalList(userId, serviceCallback);

	log.debug('Exiting GoalService.fetchMyGoalList');
};

GoalService.fetchTaglist = function(callback) {
	log.debug('Inside fetchTaglist service');

	var serviceCallback = function(error, result) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch list due to unexpected error. Please try again."}); 
		} else {
	       callback(null, {"success":true, "tagList":result});
	    }
	};

	GoalRepository.fetchTaglist(serviceCallback);

	log.debug('Exiting GoalService.fetchTaglist');
};


GoalService.createGoal = function(goalDetails, callback) {
	log.debug('Creating new Goal');
	//log.debug('Received new GoalDetail from Client: ' + JSON.stringify(goalDetails));

	var GoalModel={"tagId":goalDetails.tagId, "goalTypeId":goalDetails.goalTypeId,
		"goalName":goalDetails.goalName, "goalDescription":goalDetails.goalDescription,
		"goalTargetValue":goalDetails.goalTargetValue,
		"goalUnit":goalDetails.goalUnit, "createdDate":new Date(),
		"createdBy":goalDetails.userId, "active":true};

		//log.debug('typeof goal.goalStartDate %s and goal.goalStartDate %j:',typeof goal.goalStartDate, goal.goalStartDate);
	
	var UserGoalModel={"userId":goalDetails.userId, "goalStartDate":goalDetails.goalStartDate,
		"goalEndDate":goalDetails.goalEndDate, "createdDate":new Date(),
		"createdBy":goalDetails.createdBy, "active":true};

	var serviceCallback = function(error, goalResult) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error); 
		} else {
			// This means Goal successfully created in DB: F_GOAL table
			var goalId=goalResult.insertId;
			UserGoalModel.goalId=goalId;
			// Now going to create new row in F_USER_GOAL table

			GoalRepository.createUserGoalMap(UserGoalModel, function(err, userGoalResult){
				if (err) {
					// NOTE: Need to rollback commit of F_GOAL if control reaches here, i.e. F_USER_GOAL insert failed
					log.error('Error during DB access');
					callback(err);
				} else {
					var userGoalId=userGoalResult.insertId;
					callback(null, {"success":true, "goalId":goalId, "userGoalId":userGoalId});
				}
			});
		}
	};
	
	GoalRepository.createGoal(GoalModel, serviceCallback);

	log.debug('Exiting GoalService.createGoal');
};


GoalService.createGoalLog = function(goalLogDetails, callback) {
	log.debug('In Service layer , creating new GoalLog');

	var serviceCallback = function(error) {
		if (error) {
			log.error('Error during DB access for Inserting into F_GOAL_TRACKER');
		  	callback(error); 
		} else {
			// This means row successfully inserted in F_GOAL_TRACKER
			GoalRepository.find(goalLogDetails.goalId, function(err, goalResult){
				if (err) {
					// NOTE: Need to rollback commit of F_GOAL if control reaches here, i.e. F_USER_GOAL insert failed
					log.error('Error during DB access while updating GoalProgressPercent');
					callback(err);
				} else {
					if(typeof goalResult === 'undefined'){
						//NOTE: We may have to maintain a list of ErrorCodes and return it to CLient, such as this scenario
						log.debug('Returning to Client as no matching GoalId found in DB for goalId:'+goalLogDetails.goalId);
						callback(null, {"success":false, "description":"No matching GoalId found in DB for goalId:"+goalLogDetails.goalId});
					}
					var goalProgressPercent = calculateGoalProgress(goalResult,goalLogDetails);
					// NOTE: Below DB update can be sent to JRabbit Messaage Queue, while we already returned GoalProgressPercent to Client
					GoalRepository.updateGoalProgressPercent({"userGoalId":goalLogDetails.userGoalId, "modifiedDate":new Date(), "goalProgressPercent":goalProgressPercent}, function(err, result){
						if (err) {
							// NOTE: Need to rollback commit of F_GOAL if control reaches here, i.e. F_USER_GOAL insert failed
							log.error('Error during DB access while updating GoalProgressPercent');
							callback(err);
						} else {
							// NOTE: We won't wait for DB to commit goalProgress. We will return to Client even before that.
							// Therefore nothing to return here to Client
							log.debug('successfully updated goalProgressPercent for userGoalId:'+goalLogDetails.userGoalId)
						}
					});
					callback(null, {"success":true, "goalProgressPercent":goalProgressPercent});
				}
			});
		}
	};
	
	var goalLogModel={"userGoalId":goalLogDetails.userGoalId, "logValue":goalLogDetails.logValue,
		"logUnit":goalLogDetails.logUnit, "logNotes":goalLogDetails.logNotes,
		"logDate":goalLogDetails.logDate};

	GoalRepository.createGoalLog(goalLogModel, serviceCallback);

	log.debug('Exiting GoalService.createGoal');
};

function calculateGoalProgress(goal, goalLog){
	var targetValue = goal.goalTargetValue;
	var achievedValue = goalLog.logValue;
	var goalProgressPercent = Math.round(achievedValue/targetValue*100);
	goalProgressPercent=goalProgressPercent>100?100:goalProgressPercent;
	goalProgressPercent=goalProgressPercent<0?0:goalProgressPercent;
	return goalProgressPercent;
};


GoalService.fetchUserGoal = function(userGoalId, callback) {
	log.debug('Inside fetchUserGoal service');

	var serviceCallback = function(error, success, goal) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch Goal due to unexpected error. Please try again."}); 
		} else {
			if(success && goal && typeof goal!=='undefined'){
				goal.goalStartDate=goal.goalStartDate?dateFormat(goal.goalStartDate, nconf.get('myDateFormat')):null;
				goal.goalEndDate=goal.goalEndDate?dateFormat(goal.goalEndDate, nconf.get('myDateFormat')):null;
				
				callback(null, {"success":true, "goal":goal});
			}else if(!success)
	       		callback(null, {"success":false, "description":"userGoalId doesn\'t exist:"+userGoalId});
	    }
	};

	GoalRepository.fetchGoal(userGoalId, serviceCallback);

	log.debug('Exiting GoalService.fetchUserGoal');
};


GoalService.fetchGoalTracker = function(userGoalId, callback) {
	log.debug('Inside fetchGoalTracker service');

	var serviceCallback = function(error, success, goalTracker) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch GoalTracker due to unexpected error. Please try again."}); 
		} else {
			if(success){
				callback(null, {"success":true, "goalTracker":goalTracker});
			}else
	       		callback(null, {"success":false, "description":"userGoalId doesn\'t exist:"+userGoalId});
	    }
	};

	GoalRepository.fetchGoalTracker(userGoalId, serviceCallback);

	log.debug('Exiting GoalService.fetchGoalTracker');
};

GoalService.fetchGoalList = function(tagId, goalTypeId, callback) {
	log.debug('Inside fetchGoalList');

	var serviceCallback = function(error, result) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch list due to unexpected error. Please try again."}); 
		} else {

	       callback(null, {"success":true, "goalList":result});
	    }
	};

	GoalRepository.fetchGoalList(tagId, goalTypeId, serviceCallback);

	log.debug('Exiting GoalService.fetchGoalList');
};

GoalService.fetchGoalMemberList = function(goalId, callback) {
	log.debug('Inside fetchGoalMemberList');

	var serviceCallback = function(error, result) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch list due to unexpected error. Please try again."}); 
		} else {

	       callback(null, {"success":true, "goalMemberList":result});
	    }
	};

	GoalRepository.fetchGoalMemberList(goalId, serviceCallback);

	log.debug('Exiting GoalService.fetchGoalMemberList');
};


GoalService.createUserGoal = function(userGoalDetails, callback) {
	log.debug('Inside createUserGoal');
	//log.debug('Received new GoalDetail from Client: ' + JSON.stringify(goalDetails));
	//log.debug('typeof goal.goalStartDate %s and goal.goalStartDate %j:',typeof goal.goalStartDate, goal.goalStartDate);
	
	var UserGoalModel={"userId":userGoalDetails.userId, "goalId":userGoalDetails.goalId, "goalStartDate":userGoalDetails.goalStartDate,
		"goalEndDate":userGoalDetails.goalEndDate, "createdDate":new Date(),
		"createdBy":userGoalDetails.userId, "active":true};

	var serviceCallback = function(err, userGoalResult){
		if (err) {
			// NOTE: Need to rollback commit of F_GOAL if control reaches here, i.e. F_USER_GOAL insert failed
			log.error('Error during DB access');
			callback(err);
		} else {
			var userGoalId=userGoalResult.insertId;
			callback(null, {"success":true, "userGoalId":userGoalId});
		}
	}
	
	GoalRepository.createUserGoalMap(UserGoalModel, serviceCallback);

	log.debug('Exiting GoalService.createUserGoal');
};


GoalService.fetchUserGoal = function(userId, goalId, callback) {
	log.debug('Inside fetchUserGoal');

	var outerServiceCallback = function(error, user) {
		if (error) {
			log.error('Error during DB access for user fetch');
			callback(error, {"success":false, "description": "Could not fetch user obj due to unexpected DB error. Please try again."}); 
		} else {
			if(user && typeof user!=='undefined' && user.length > 0){
				//callback(null, {"success":true, "userList":user});
				var innerServiceCallback = function(error, success, goal) {
					if (error) {
						log.error('Error during DB access');
					  	callback(error, {"success":false, "description": "Could not fetch Goal due to unexpected error. Please try again."}); 
					} else {
						if(success && goal && typeof goal!=='undefined'){
							log.debug("I reached here....");
							goal.goalStartDate=goal.goalStartDate?dateFormat(goal.goalStartDate, nconf.get('myDateFormat')):null;
							goal.goalEndDate=goal.goalEndDate?dateFormat(goal.goalEndDate, nconf.get('myDateFormat')):null;
							
							callback(null, {"success":true, "user":user, "goal":goal});
						}else
				       		callback(null, {"success":false, "description":"userGoalId doesn\'t exist:"+userGoalId});
				    }
				}
				GoalRepository.fetchGoal(userId, goalId, innerServiceCallback);

			}else
	       		callback(null, {"success":false, "description":"userId doesn\'t exist:"+userId});
	    }
	};

	UserRepository.find(userId, outerServiceCallback);

	log.debug('Exiting GoalService.fetchUserGoal');
};


GoalService.fetchUserGoalList = function(friendUserId, loggedInUserId, callback) {
	log.debug('Inside fetchUserGoalList');

	var serviceCallback = function(error, result) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error, {"success":false, "description": "Could not fetch list due to unexpected error. Please try again."}); 
		} else {

	       callback(null, {"success":true, "userGoalList":result});
	    }
	};

	GoalRepository.fetchUserGoalList(friendUserId, loggedInUserId, serviceCallback);

	log.debug('Exiting GoalService.fetchUserGoalList');
};




exports.GoalService = GoalService;
