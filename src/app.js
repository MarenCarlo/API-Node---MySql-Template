const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const app = express();
const morgan = require('morgan');
require('dotenv').config();

/**
 * Configuraciones del Servidor
 */
//Puerto
app.set('port', process.env.SV_PORT || 3031);
app.use(helmet());

//CORS
const whiteList = [process.env.CR_DOMAIN_1, process.env.CR_DOMAIN_2];
var corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: "GET, HEAD, PUT, PATCH ,DELETE",
    preflightContinue: false,
}
app.use(cors(corsOptions));

//Middleware
const validateToken = require('./middleware/validate-token');

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Uso de Rutas
app.get('/', (req, res) => {
    res.status(200).json({
        estado: true,
        title: process.env.APP,
        message_info: 'Versiones disponibles de la API',
        API_Versions: [
            {
                url: '/v1/',
                message: 'first Version of the API with basic functions and authentication system.',
                state: "Beta"
            }
        ],
    })
});

/**
 * API Beta V0.5.1
 */
/**
 * Importacion de Rutas
 */
const defaultRoute = require('./routes/default');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
//auth route
const authRoute = require('./routes/auth');

//Public Routes
app.use('/v1', authRoute);
app.use('/v1', defaultRoute);
//Protected Routes
app.use(
    '/v1',
    validateToken,
    usersRoute
);
app.use(
    '/v1',
    validateToken,
    productsRoute
);

export default app;