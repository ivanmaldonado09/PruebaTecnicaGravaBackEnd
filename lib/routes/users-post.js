'use strict';
const router = require('express').Router();
const logger = require('../logger');
const Joi = require('joi');
const {User, UserInformation} = require('../models');

function validateFields(req, res, next) {
    // TODO:
    // - name: string, al menos 3 caracteres
    // - color: string, uno de estos valores: "red", "green", "blue"
    // - email: string
    // - name: String
    // Ver los campos que son requeridos
    const schemna = Joi.object({
        name: Joi.string().min(3).required(),
        color: Joi.string().valid('red', 'green', 'blue').required(),
        email: Joi.string().email().required(),
        dni: Joi.string().max(20).required(),
        lastName: Joi.string().required(),
        age: Joi.number().integer().min(0).max(120).required()
    });
    const {error} = schemna.validate(req.body);
    if (error) {
        return res.status(400).json({
            code: 'Error en la validacion de los campos',
            message: error.message
        });
    }


    return next();
}

function createUserInformation(req, res, next) {
    // Crear modelo UserInformation relacionado a User
    return UserInformation.create({
        name: req.body.name,
        lastName: req.body.lastName,
        dni: req.body.dni,
        age: req.body.age,

    })
    .then((userInformation) => {
        req.body.userInformation = userInformation._id;
        return next();
    }
    )
    .catch((error) => {
        logger.error(`POST /users - createUserInformation error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    });
    // ...
}

function saveUser(req, res) {
    // TODO: crear user con todos los campos correctos
    return User.create({
        email: req.body.email,
        color: req.body.color,
        userInformation: req.body.userInformation
    })
        .then((user) => {
            return res.status(201).json(user.toJSON());
        })
        .catch((error) => {
            logger.error(`POST /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

async function disableUser(req, res) {

    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                code: 'usuario_no_encontrado',
                message: 'No se encontro el usuario'
            });
        }

        if (!user.enabled) {
            return res.status(400).json({
                code: 'usuario_ya_deshabilitado',
                message: 'El usuario ya esta deshabilitado'
            });
        }

        user.enabled = false;
        await user.save();
        return res.status(200).json({
            code: 'usuario_deshabilitado',
            message: 'El usuario fue deshabilitado'
        });

} catch (error) {

        logger.error(`POST /users/:id/disable - error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    }
}

router.post(
    '/users',
    validateFields,
    createUserInformation,
    saveUser,
);

router.post(
    '/users/:id/disable',
    disableUser
);

module.exports = router;
