'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User} = require('../models');



async function patchUser(req, res) {
    
}

router.patch(
    '/users/:id',
    patchUser
);



module.exports = router;
