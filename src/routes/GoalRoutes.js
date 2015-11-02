var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var GoalService = require('../service/GoalService.js').GoalService;

router.get('/mygoallist/:userId', function(req, res) {
  log.debug('Inside /mygoallist router. userId:'+ userId);
	var userId = req.params.userId;

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


module.exports = router;


