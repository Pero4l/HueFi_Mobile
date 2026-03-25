const express = require('express');
const router = express.Router();

const { getWalletBalance, sendTokens, getTransactions } = require('../controllers/walletLogic');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/balance', authMiddleware, getWalletBalance);
router.post('/send', authMiddleware, sendTokens);
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;
