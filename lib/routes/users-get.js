'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User} = require('../models');



async function getUsers(req, res) {
    try {
        const { enabled, ordenarPor } = req.query;

        const filter = {};
        if (enabled !== undefined) {
            filter.enabled = enabled === 'true';
        }
        

        const ordenar ={};
        if(ordenarPor){
            ordenar[ordenarPor] = 1;
        }

        const users = await User.find(filter)
            .populate('userInformation')
            .sort(ordenar);

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
