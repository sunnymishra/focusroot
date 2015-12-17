var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var GoalService = require('../service/GoalService.js').GoalService;

router.get('/mygoallist', function(req, res) {
	var userId = req.query.userId;
  log.debug('Inside /mygoallist?userId router. userId:'+ userId);
  
	var routerCallback = function(error, result) {
		if (error) {
    	  	res.status(409).send(error);
    	} else {
        	res.json(result);
        }
   	};
   	
	GoalService.fetchMyGoalList(userId, routerCallback);
  log.debug('exiting from /mygoallist?userId router');
});

router.get('/taglist', function(req, res) {
  log.debug('Inside /taglist router');

  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchTaglist(routerCallback);
  log.debug('exiting from /taglist router');
});

router.post('/mygoal', function(req, res) {
  log.debug('Inside /mygoal POST router');
  var goalDetails=req.body;
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.createGoal(goalDetails, routerCallback);
  log.debug('exiting from /mygoal POST router');
});


router.post('/goallog', function(req, res) {
  log.debug('Inside /goallog POST router');
  var goalLogDetails=req.body;
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.createGoalLog(goalLogDetails, routerCallback);
  log.debug('exiting from /goallog POST router');
});

router.get('/mygoal', function(req, res) {
  log.debug('Inside /mygoal GET router');
  var userGoalId=req.query.userGoalId;
  log.debug('userGoalId : --->'+userGoalId);
  //var goalId=req.params.goalId;
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchUserGoal(userGoalId, routerCallback);
  log.debug('exiting from /mygoal GET router');
});

router.get('/goaltracker', function(req, res) {
  log.debug('Inside /goaltracker GET router');
  var userGoalId=req.query.userGoalId;

  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchGoalTracker(userGoalId, routerCallback);
  log.debug('exiting from /goaltracker GET router');
});

router.get('/goalmembers', function(req, res) {
  var goalId = req.query.goalId;
  log.debug('Inside /goalmembers?goalId=%s GET router.', goalId);
  
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchGoalMemberList(goalId, routerCallback);
  log.debug('exiting from /goalmembers GET router');
});


router.get('/usergoal', function(req, res) {
  var userGoalDetails=req.body;
  var userId=req.query.userId;
  var goalId=req.query.goalId;
  //var friend=req.query.friend;
  log.debug('Inside /usergoal?userId=%s&goalId=%s GET router', userId, goalId);

  var routerCallback = function(error, result) {
    if (error) {
      res.status(409).send(error);
    } else {
      res.json(result);
    }
  };
    
  GoalService.fetchUserGoal(userId, goalId, routerCallback);
  log.debug('exiting from /usergoal GET router');
});

















router.get('/goallist', function(req, res) {
  var tagId = req.query.tagId;
  var goalTypeId = req.query.goalTypeId;
  log.debug('Inside /goallist?tagId=%s&goalTypeId=%s GET router.', tagId, goalTypeId);
  
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchGoalList(tagId, goalTypeId, routerCallback);
  log.debug('exiting from /goallist GET router');
});


router.post('/usergoal', function(req, res) {
  log.debug('Inside /usergoal POST router');
  var userGoalDetails=req.body;

  var routerCallback = function(error, result) {
    if (error) {
      res.status(409).send(error);
    } else {
      res.json(result);
    }
  };
    
  GoalService.createUserGoal(userGoalDetails, routerCallback);
  log.debug('exiting from /usergoal POST router');
});

module.exports = router;


