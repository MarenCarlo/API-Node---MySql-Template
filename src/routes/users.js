import { Router } from 'express';
import { methods as usersController } from '../controller/users-controller';
const validateState = require('../middleware/validate-user-states');
const validateAdmin = require('../middleware/validate-administrator');
const validateDev = require('../middleware/validate-developer');
const validateMKey = require('../middleware/validate-master-key');
const validateDevKey = require('../middleware/validate-developer-key');

const router = Router();
/**
 * Controlador del enrutamiento de las peticiones HTTP de las rutas de Usuarios
 */
router.get('/users_list', validateState, validateDev, validateMKey, validateDevKey, usersController.getUsersList);

router.post('/register', validateState, validateAdmin, usersController.registerUser);

router.patch('/user_state/:id', validateState, validateAdmin, validateMKey, usersController.activateUser);

module.exports = router;