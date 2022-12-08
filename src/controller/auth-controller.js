import { getConnection } from '../database/database';
require('dotenv').config();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const schemaLogin = Joi.object({
    nameUser: Joi.string().min(4).max(32).required(),
    passUser: Joi.string().min(8).max(32).required()
});

/**
 * POST Usuario (Logearse con un usuario)
 */
const loginUser = async (req, res) => {
    try {
        var ip = req.socket.remoteAddress;
        console.log(ip);
        const { error } = schemaLogin.validate(req.body);
        if (error) {
            res.status(400).json({
                error: true,
                message: error.details[0].message
            });
        } else {
            const connection1 = await getConnection();
            const sql1 = `
                SELECT
                    users.id_user,
                    users.nameUser,
                    states.id_state,
                    states.stateName,
                    roles.id_role,
                    roles.roleName
                FROM
                    users
                INNER JOIN states ON users.fk_state = states.id_state
                INNER JOIN roles ON users.fk_role = roles.id_role
                WHERE users.nameUser = ?
            `
            let query_result = await connection1.query(sql1, req.body.nameUser);

            if (query_result[0] !== undefined) {
                if (query_result[0].id_state == process.env.US_ACTIVE_STATE) {
                    const connection2 = await getConnection();
                    const sql2 = `
                        SELECT
                            users.passUser
                        FROM
                            users
                        WHERE users.nameUser = ?
                    `
                    let result2 = await connection2.query(sql2, query_result[0].nameUser);
                    //validacion de Hash de Password
                    const validPassword = await bcrypt.compare(req.body.passUser, result2[0].passUser);
                    if (!validPassword) {
                        res.status(401).json({ error: true, message: 'La contraseña es incorrecta...' });
                    } else {
                        const token = jwt.sign({
                            user_id: query_result[0].id_user,
                            user_name: query_result[0].nameUser,
                            user_state: query_result[0].stateName,
                            user_role: query_result[0].roleName
                        }, process.env.TOKEN_SECRET, {
                            expiresIn: 43200 // 12 hours
                        })
                        res.header('auth-token', token).json({
                            error: false,
                            message: "Logueado Correctamente!",
                            token,
                            query_result
                        })
                    }
                } else {
                    res.status(401).json({
                        error: true,
                        message: "Este usuario debe ser activado por un administrador, para poder ingresar al Software..."
                    })
                }
            } else {
                res.status(404).json({
                    error: true,
                    message: "No existe ningun usuario con el nombre de Usuario: " + req.body.nameUser
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}
export const methods = {
    loginUser,
}