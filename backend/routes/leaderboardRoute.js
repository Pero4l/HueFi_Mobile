const express = require('express');
const router = express.Router();

const { getLeaderboard, updatePoints } = require('../controllers/leaderboardController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get("/leaderboard", getLeaderboard);
router.put("/update-points", authMiddleware, updatePoints);

module.exports = router;