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
		"goalUnit":goalDetails.goalUnit, "goalStartDate":goalDetails.goalStartDate,
		"goalEndDate":goalDetails.goalEndDate, "createdDate":new Date(),
		"createdBy":goalDetails.userId, "active":true};

		//log.debug('typeof goal.goalStartDate %s and goal.goalStartDate %j:',typeof goal.goalStartDate, goal.goalStartDate);
	
	var UserGoalModel={"userId":goalDetails.userId, "createdDate":new Date(),
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

			GoalRepository.createUserGoalMap(UserGoalModel, function(err, result){
				if (err) {
					// NOTE: Need to rollback commit of F_GOAL if control reaches here, i.e. F_USER_GOAL insert failed
					log.error('Error during DB access');
					callback(err);
				} else {
					callback(null, {"success":true, "goalId":goalId});
				}
			});
		    
			//callback(null, {"success":true, "goalId":goal.goalId});

		}
	};
	
	GoalRepository.createGoal(GoalModel, serviceCallback);

	log.debug('Exiting GoalService.createGoal');
};



exports.GoalService = GoalService;
