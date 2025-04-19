'use strict';
const router = require('express').Router();
const logger = require('../logger');
const Joi = require('joi');
const {User} = require('../models');



async function patchUserColor(req, res) {
    
    const userId = req.params.id;
    const {color } = req.body;

const schemna = Joi.object({
        color: Joi.string().valid('red', 'green', 'blue').required()
    });
    const {error} = schemna.validate(req.body);
    if (error) {
        return res.status(400).json({
            code: 'Color no valido',
            message: error.message
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                code: 'usuario_no_encontrado',
                message: 'No se encontro el usuario'
            });
        }

        user.color = color;
        await user.save();


} catch (error) {
        logger.error(`PATCH /users/:id - error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    }

    return res.status(200).json({
        code: 'usuario_actualizado',
        message: 'El usuario fue actualizado'
    });
}

router.patch(
    '/users/:id',
    patchUserColor
);



module.exports = router;
