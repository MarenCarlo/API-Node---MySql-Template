const jwt = require('jsonwebtoken')
import { getConnection } from '../database/database';
require('dotenv').config();

// middleware to validate token (rutas protegidas)
const verifyAdmin = async (req, res, next) => {
    const token = req.header('auth-token');
    /**
     * Condicional que sirve para validar el token de sesion activa.
     */
    if (!token) return res.status(401).json({ error: true, message: 'Acceso denegado' });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        const userId = req.user.user_id
        const sql_role = `
            SELECT
                users.id_user,
                roles.id_role
            FROM
                users
            INNER JOIN roles ON users.fk_role = roles.id_role
            WHERE users.id_user = ?
        `
        const connection1 = await getConnection();
        let query_result = await connection1.query(sql_role, userId);
        if (query_result[0].id_role == process.env.US_ADMIN_ROLE) {
            /**
             * La funcion Next() la utilizamos para indicar que si nuestro token es correcto
             * continue a mostrar el siguiente documento, o en este caso la ruta que se esta
             * requiriendo por el usuario.
             */
            next();
        } else {
            res.status(401).json({
                tokenError: true,
                message: 'Se requieren permisos de administrador para obtener este recurso...'
            })
        }
    } catch (error) {
        res.status(401).json({
            tokenError: true,
            message: 'token no es válido'
        })
    }
}
module.exports = verifyAdmin;