import { getConnection } from '../database/database';
/**
 * GET Products List
 * Esta petición se usa para obtener el listado de productos completo.
 */
const getProductsList = async (req, res) => {
    try {
        var ip = req.socket.remoteAddress;
        console.info(ip);
        const connection = await getConnection();
        let result = await connection.query('SELECT * FROM products_test ORDER BY added_date DESC');
        res.status(200).json(
            result
        );
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * FILTROS DE LISTADO DE PRODUCTOS
 */
const getProductsFilter = async (req, res, next) => {
    try {
        const { filter } = req.params;
        var ip = req.socket.remoteAddress;
        console.info(ip);
        switch (filter) {
            //FILTRO POR NOMBRE ascendente
            case 'name="asc"':
                console.log(filter)
                const connection1 = await getConnection();
                let result1 = await connection1.query('SELECT * FROM products_test ORDER BY name_product ASC');
                res.status(200).json(result1);
                break;
            //FILTRO POR NOMBRE descendente
            case 'name="des"':
                console.log(filter)
                const connection2 = await getConnection();
                let result2 = await connection2.query('SELECT * FROM products_test ORDER BY name_product DESC');
                res.status(200).json(result2);
                break;
            //FILTRO POR PRECIO ascendente
            case 'price="asc"':
                console.log(filter)
                const connection3 = await getConnection();
                let result3 = await connection3.query('SELECT * FROM products_test ORDER BY price ASC');
                res.status(200).json(result3);
                break;
            //FILTRO POR PRECIO descendente
            case 'price="des"':
                console.log(filter)
                const connection4 = await getConnection();
                let result4 = await connection4.query('SELECT * FROM products_test ORDER BY price DESC');
                res.status(200).json(result4);
                break;
            //FILTRO POR FECHADE INGRESO descendente
            case 'added_date="asc"':
                console.log(filter)
                const connection5 = await getConnection();
                let result5 = await connection5.query('SELECT * FROM products_test ORDER BY added_date ASC');
                res.status(200).json(result5);
                break;
            //FILTRO POR FECHADE INGRESO descendente
            case 'added_date="des"':
                console.log(filter)
                const connection6 = await getConnection();
                let result6 = await connection6.query('SELECT * FROM products_test ORDER BY added_date DESC');
                res.status(200).json(result6);
                break;
            default:
                res.status(404).json({
                    message: "No se cuenta con este tipo de filtro, posiblemente te confundiste buscando un producto singular, para ese tipo la direccion products es en su singular | PRODUCT | es v1/product/:id"
                });
                break;
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * GET Product by ID (Obtener un solo producto en base a su ID)
 */
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM products_test WHERE id_product = ?", id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/**
 * POST Product (Agregar un nuevo producto)
 */
const addProduct = async (req, res, next) => {
    try {
        const { name_product, description, price } = req.body;
        if (name_product === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }
        const connection = await getConnection();
        const result = await connection.query(
            "INSERT INTO `products_test`(`name_product`, `description`, `price`, `added_date`) VALUES ('" + name_product + "','" + description + "','" + price + "', NOW())"
        );
        res.json({
            message: "Producto Agregado...",
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/**
 * PATCH Product (Editar un producto)
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_product, description, price } = req.body;

        if (name_product === undefined || description === undefined || price === undefined) {
            res.status(400).json({ message: "Todos los campos son requeridos..." });
        }
        if (id === undefined) {
            res.status(400).json({ message: "No se recibio el identificador para el producto a editar..." });
        }
        const sql = `
            UPDATE products_test
            SET 
                name_product = '${name_product}', 
                description = '${description}', 
                price = '${price}'
            WHERE id_product = ?;`

        const connection = await getConnection();
        const result = await connection.query(sql, id);
        res.json({
            message: "Producto Editado...",
            result
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/**
 * DELETE Product (Editar un producto)
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM language WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


export const methods = {
    getProductsList,
    getProductsFilter,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
}