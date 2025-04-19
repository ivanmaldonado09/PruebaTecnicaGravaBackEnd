'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User} = require('../models');



function getUsers(req, res) {
    
}

router.get(
    '/users',
    getUsers
);

module.exports = router;
