const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const postControllerAnalytics = require('../controllers/analyticsController');

router.post('/handleEvent', eventController.handleEvent);
router.get('/popular-post', postControllerAnalytics.getPopularPosts);
router.get('/active-user', postControllerAnalytics.getActiveUsers);
router.get('/response-time', postControllerAnalytics.getResponseTime);

module.exports = router;
