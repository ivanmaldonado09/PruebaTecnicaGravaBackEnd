'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User} = require('../models');



async function getUsers(req, res) {
    try {
        const { enabled, sortBy } = req.query;

        const filter = {};
        if (enabled !== undefined) {
            filter.enabled = enabled === 'true';
        }
        

        const sort ={};
        if(sortBy){
            sort[sortBy] = 1;
        }

        const users = await User.find(filter)
            .populate('userInformation')
            .sort(sort);

        return res.status(200).json(users);

} catch (error) {
        logger.error(`GET /users - error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    }
}	

router.get(
    '/users',
    getUsers
);

module.exports = router;
