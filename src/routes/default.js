import { Router } from 'express';

const router = Router();

//Ruta Default
router.get('/', (req, res) => {
    var ip = req.socket.remoteAddress;
    console.info(ip);
    res.status(200).json({
        estado: true,
        title: process.env.APP,
        version: "v0.5.0",
        state: "Beta",
        message_public: 'Routes that can be consumed without the need for an authentication token.',
        public_routes: [
            {
                url: '/v1/login',
                methods: 'POST'
            },
        ],
        message_private: 'Routes that can be consumed only with an authentication token.',
        private_routes: [
            {
                url: '/v1/register',
                methods: 'POST',
                header: 'auth-token'
            },
            {
                url: '/v1/user_state/:id',
                methods: 'PATCH',
                header: 'auth-token'
            },
            {
                url: '/v1/products',
                methods: 'GET, POST',
                header: 'auth-token'
            },
            {
                url: '/v1/products/:filter',
                methods: 'GET',
                header: 'auth-token',
                filters: 'name="asc", name="des", price="asc", price="des", added_date="asc", added_date="des"'
            },
            {
                url: '/v1/product/:id',
                methods: 'GET, PATCH',
                header: 'auth-token'
            },
        ]
    })
});

module.exports = router;