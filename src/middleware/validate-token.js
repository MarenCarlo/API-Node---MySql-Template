const jwt = require('jsonwebtoken')
require('dotenv').config();

// middleware to validate token (rutas protegidas)
const verifyToken = async (req, res, next) => {
    const token = req.header('auth-token');
    /**
     * Condicional que sirve para validar el token de sesion activa.
     */
    if (!token) return res.status(401).json({ error: true, message: 'Acceso denegado' });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        /**
         * La funcion Next() la utilizamos para indicar que si nuestro token es correcto
         * continue a mostrar el siguiente documento, o en este caso la ruta que se esta
         * requiriendo por el usuario.
         */
        next();
    } catch (error) {
        res.status(401).json({
            tokenError: true,
            message: 'token no es válido'
        })
    }
}
module.exports = verifyToken;