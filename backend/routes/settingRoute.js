const express = require('express');
const router = express.Router();

const { getMnemonic, getPrivateKey } = require('../controllers/settings');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/mnemonic', authMiddleware, getMnemonic);
router.get('/private-key', authMiddleware, getPrivateKey);

module.exports = router;