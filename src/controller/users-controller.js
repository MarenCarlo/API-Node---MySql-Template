import { getConnection } from '../database/database';
require('dotenv').config();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const schemaRegister = Joi.object({
    nameUser: Joi.string().min(4).max(32).required(),
    passUser: Joi.string().min(8).max(32).required(),
    //state: Joi.string().min(1).max(2).required(),
    role: Joi.string().min(1).max(2).required(),
});

/**
 * GET Products List
 * Esta petición se usa para obtener el listado de productos completo.
 */
const getUsersList = async (req, res) => {
    try {
        var ip = req.socket.remoteAddress;
        console.info(ip);
        const connection = await getConnection();
        const sql = `
            SELECT
                users.id_user,
                users.nameUser,
                states.stateName,
                roles.roleName,
                users.added_date
            FROM
                users
            INNER JOIN states ON users.fk_state = states.id_state
            INNER JOIN roles ON users.fk_role = roles.id_role
            ORDER BY
                added_date ASC;
        `
        let result = await connection.query(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(
            error
        );
    }
}

/**
 * POST usuario (Registrar a un usuario nuevo)
 */
const registerUser = async (req, res, next) => {
    try {
        /**
     * Validacion de datos requeridos del usuario a Registrar
     */
        const { error } = schemaRegister.validate(req.body);
        if (error) {
            res.status(400).json(
                { error: error.details[0].message }
            )
        } else {
            const connection1 = await getConnection();
            let result1 = await connection1.query('SELECT nameUser FROM users WHERE nameUser = ?', req.body.nameUser);
            if (result1[0] === undefined) {
                /**
                 * Encriptacion de Contraseñas de Usuarios
                 */
                const salt = await bcrypt.genSalt(12);
                const cryptedPass = await bcrypt.hash(req.body.passUser, salt);
                const nameUser = req.body.nameUser;
                const role = req.body.role;

                const connection2 = await getConnection();
                await connection2.query(
                    "INSERT INTO `users` (`nameUser`, `passUser`, `fk_state`, `fk_role`, `masterKey`, `added_date`) VALUES ('" + nameUser + "', '" + cryptedPass + "', '2', '" + role + "', '0', NOW());"
                );
                res.status(201).json({
                    message: "Usuario Registrado Exitosamente..."
                });
            } else {
                res.status(400).json({
                    error: true,
                    message: "Este Nombre de usuario ya ha sido registrado anteriormente"
                })
            }
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

/**
 * PATCH User (Activar un Usuario)
 */
const activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { own_id } = req.body;
        const { user_state } = req.body;

        if (user_state === undefined) {
            res.status(404).json({ message: "Todos los campos son requeridos..." });
        }
        if (id === undefined || id === " " || id === null) {
            res.status(404).json({ message: "No se recibio el identificador para el usuario a activar/desactivar..." });
        }
        if (own_id === undefined) {
            res.status(404).json({ message: "No se recibio identificador de usuario activador..." });
        }
        if (id === own_id) {
            res.status(404).json({ message: "No se puede desactivar a este usuario desde este usuario..." });
        } else {
            const sql1 = `
                SELECT
                    users.masterKey
                FROM
                    users 
                WHERE id_user = ?;
            `
            const connection1 = await getConnection();
            const result1 = await connection1.query(sql1, id);
            if (result1[0] !== undefined) {
                if (result1[0].masterKey == process.env.US_MASTER_KEY) {
                    res.status(400).json({ message: "Es Imposible desactivar a este usuario..." });
                } else {
                    const sql = `
                        SELECT
                            users.developer
                        FROM
                            users 
                        WHERE id_user = ?;
                    `
                    const connection = await getConnection();
                    const result = await connection.query(sql, id);
                    if (result[0] !== undefined) {
                        if (result[0].developer == process.env.US_DEVELOPER_KEY) {
                            res.status(400).json({ message: "Es Imposible desactivar a este usuario..." });
                        } else {
                            const sql2 = `
                                UPDATE users 
                                SET 
                                    fk_state = '${user_state}' 
                                WHERE id_user = ?;
                            `
                            const connection2 = await getConnection();
                            const result2 = await connection2.query(sql2, id);
                            if (user_state == process.env.US_ACTIVE_STATE) {
                                res.json({
                                    message: "Usuario Activado Exitosamente...",
                                    result2
                                });
                            }
                            if (user_state == process.env.US_INACTIVE_STATE) {
                                res.json({
                                    message: "Usuario Desactivado Exitosamente...",
                                    result2
                                });
                            }
                        }
                    }
                }
            } else {
                res.status(400).json({ message: "Este identificador de usuario no existe en la BD..." });
            }
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const methods = {
    getUsersList,
    registerUser,
    activateUser,
}

