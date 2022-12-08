const jwt = require('jsonwebtoken')
import { getConnection } from '../database/database';
require('dotenv').config();

// middleware to validate token and active users (rutas protegidas)
const verifyStates = async (req, res, next) => {
    const token = req.header('auth-token');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        const userId = verified.user_id
        const connection1 = await getConnection();
        const sql_state = `
            SELECT
                users.id_user,
                states.id_state
            FROM
                users
            INNER JOIN states ON users.fk_state = states.id_state
            WHERE users.id_user = ?
        `
        let query_result = await connection1.query(sql_state, userId);
        if (query_result[0].id_state == process.env.US_ACTIVE_STATE) {
            next();
        } else {
            res.status(401).json({
                tokenError: true,
                message: 'Este usuario no ha sido activado por un administrador del sistema...'
            })
        }
    } catch (error) {
        res.status(401).json({
            tokenError: true,
            message: 'token no es válido'
        })
    }
}
module.exports = verifyStates;