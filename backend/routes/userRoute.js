const express = require('express');
const router = express.Router();

const {usersCreation, usersLogin} = require('../controllers/usersController');

router.post("/register", usersCreation);
router.post("/login", usersLogin);

module.exports = router;