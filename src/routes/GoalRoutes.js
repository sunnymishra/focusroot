var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var GoalService = require('../service/GoalService.js').GoalService;

router.get('/mygoallist/:userId', function(req, res) {
	var userId = req.params.userId;
    log.debug('Inside /mygoallist router. userId:'+ userId);
  
	var routerCallback = function(error, result) {
		if (error) {
    	  	res.status(409).send(error);
    	} else {
        	res.json(result);
        }
   	};
   	
	GoalService.fetchMyGoalList(userId, routerCallback);
  log.debug('exiting from /mygoallist router');
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


module.exports = router;


