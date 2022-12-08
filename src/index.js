import app from './app';
require('dotenv').config();

const main = () => {
    /**
     * Iniciador del Servidor
     */
    app.listen(app.get("port"), () => {
        console.log(`${process.env.SV_APP} funcionando exitosamente en el puerto: ${app.get("port")}.`)
    })
}

main();