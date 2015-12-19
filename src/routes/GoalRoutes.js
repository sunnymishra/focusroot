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
    
  GoalService.fetchMyUserGoal(userGoalId, routerCallback);
  log.debug('exiting from /mygoal GET router');
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


router.get('/goaltracker', function(req, res) {
  log.debug('Inside /goaltracker GET router');
  var userGoalId=req.query.userGoalId;
  var isLessDataRequired=req.query.lessData;
  var routerCallback = function(error, result) {
    if (error) {
        res.status(409).send(error);
    } else {
      res.json(result);
    }
  };
    
  GoalService.fetchGoalTracker(userGoalId, isLessDataRequired, routerCallback);
  log.debug('exiting from /goaltracker GET router');
});

router.get('/mygoalmembers', function(req, res) {
  var goalId = req.query.goalId;
  log.debug('Inside /mygoalmembers?goalId=%s GET router.', goalId);
  
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchMyGoalMemberList(goalId, routerCallback);
  log.debug('exiting from /mygoalmembers GET router');
});


router.get('/usergoal', function(req, res) {
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

router.get('/usergoallist', function(req, res) {
  var friendUserId=req.query.friendUserId;
  var loggedInUserId=req.query.loggedInUserId;
  log.debug('Inside /userGoalList?friendUserId=%s&loggedInUserId=%s GET router', friendUserId, loggedInUserId);

  var routerCallback = function(error, result) {
    if (error) {
      res.status(409).send(error);
    } else {
      res.json(result);
    }
  };

  GoalService.fetchUserGoalList(friendUserId, loggedInUserId, routerCallback);
  log.debug('exiting from /usergoallist GET router');
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


router.get('/goallist', function(req, res) {
  var tagId = req.query.tagId;
  var goalTypeId = req.query.goalTypeId;
  var userId = req.query.userId;

  log.debug('Inside /goallist?tagId=%s&goalTypeId=%s&userId=%s GET router.', tagId, goalTypeId, userId);
  
  var routerCallback = function(error, result) {
    if (error) {
          res.status(409).send(error);
      } else {
          res.json(result);
        }
    };
    
  GoalService.fetchGoalList(tagId, goalTypeId, userId, routerCallback);
  log.debug('exiting from /goallist GET router');
});


router.get('/goal', function(req, res) {
  var goalId=req.query.goalId;

  log.debug('Inside /goal?goalId=%s GET router', goalId);

  var routerCallback = function(error, result) {
    if (error) {
      res.status(409).send(error);
    } else {
      res.json(result);
    }
  };

  GoalService.fetchGoal(goalId, routerCallback);
  log.debug('exiting from /goal GET router');
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


