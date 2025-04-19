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


async function getUserInformationById(req, res) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)
            .populate('userInformation');
        if (!user) {
            return res.status(400).json({
                code: 'usuario_no_encontrado',
                message: 'No se encontro el usuario'
            });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        logger.error(`GET /users/:id - error: ${error.message}`);
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

router.get(
    '/users/:id',
    getUserInformationById
);


module.exports = router;
