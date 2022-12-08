import mysql from 'promise-mysql';
import config from '../config';

const connection = mysql.createConnection({
    host: config.DB_host,
    port: config.DB_port,
    database: config.DB_database,
    user: config.DB_user,
    password: config.DB_password,
    timezone: config.DB_timezone,
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const getConnection = () => {
    return connection;
}

module.exports = { getConnection };