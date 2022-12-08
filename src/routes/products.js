import { Router } from 'express';
import { methods as productController } from '../controller/products-controller';

const validateAdmin = require('../middleware/validate-administrator');
const validateState = require('../middleware/validate-user-states');

const router = Router();
/**
 * Rutas para Productos
 * Listado Completo de Productos (Por defecto ordenado por fecha de ingreso de manera Descendente
 * de esta manera siempre aparecera arriba el último producto agregado, para asi hacer más fácil
 * la tarea de ingresar listados de productos completos).
 */
router.get('/products', validateState, productController.getProductsList);

//Producto simple obtenido por ID
router.get("/product/:id", validateState, productController.getSingleProduct);

//Listado Completo de Productos ordenado por el filtro que se le indique.
router.get("/products/:filter", validateState, productController.getProductsFilter);

//Ruta para agregar un nuevo producto
router.post("/products", validateState, validateAdmin, productController.addProduct);

//Ruta para editar un producto
router.patch("/product/:id", validateState, validateAdmin, productController.updateProduct);

//Ruta para eliminar un producto
router.delete("/product/:id", validateState, validateAdmin, productController.deleteProduct)


module.exports = router;