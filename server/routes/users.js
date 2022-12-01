const path = require('path');
const express = require('express');
const {verificaAutenticacion} = require('./middleware');
const dotenv = require('dotenv');
dotenv.config()
const userController = require('../controllers/users');
const router = express.Router();
router.post('/login', userController.usersLogin);
router.get('/home/', verificaAutenticacion, userController.usersHome);

module.exports = router;