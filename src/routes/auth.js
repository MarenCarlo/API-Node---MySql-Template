import { Router } from 'express';
import { methods as authController } from '../controller/auth-controller';

const router = Router();
/**
 * Controlador del enrutamiento de las peticiones HTTP de las rutas de Usuarios
 */
router.post('/login', authController.loginUser);

module.exports = router;