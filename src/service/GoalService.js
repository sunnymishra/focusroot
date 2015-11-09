var GoalRepository = require('../database/GoalRepository.js').GoalRepository;
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
				    goal.createdDate=dateFormat(goal.createdDate, nconf.get('myDateFormat'));
				    goal.goalStartDate=dateFormat(goal.goalStartDate, nconf.get('myDateFormat'));
				    goal.goalEndDate=dateFormat(goal.goalEndDate, nconf.get('myDateFormat'));
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
					var goalProgressPercent = calculateGoalProgress(goalResult,goalLogDetails);
					// NOTE: Below DB update can be sent to JRabbit Messaage Queue, while we already returned GoalProgressPercent to Client
					GoalRepository.updateGoalProgressPercent({"userGoalId":goalLogDetails.userGoalId,"goalProgressPercent":goalProgressPercent}, function(err, result){
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


exports.GoalService = GoalService;
