import { config } from "dotenv";

config();

export default {
    DB_host: process.env.DB_HOST || "",
    DB_database: process.env.DB_DATABASE || "",
    DB_port: process.env.DB_PORT || "",
    DB_user: process.env.DB_USER || "",
    DB_password: process.env.DB_PASSWORD || "",
    DB_timezone: process.env.DB_TIMEZONE || "UTC+0"
}