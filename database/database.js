import { Sequelize } from "sequelize";
import { production } from '../config/database.js';
import 'dotenv/config'


const sql_env = () => {
    if (process.env.ENV === 'development') {
        // Constructor signature is: (database, username, password, options)
        return new Sequelize(
            "xianfire-enhanced-database", 
            "root", // <--- Swapped to Username
            "mYNSn4qm6sgEez29agtW7dbfs7MG08YamNf8VPQfSaHxXssW26vXXa7drW3urJxn", 
            {
                host: "localhost",
                dialect: "mysql"
            }
        );
    } 
    else if (process.env.ENV === 'production') {
        return new Sequelize(
            production.database, 
            production.username || 'root', // <--- Ensure you use a username property here
            production.password,           // <--- Ensure you use a password property here
            {
                host: production.host,
                dialect: production.dialect,
                // If your production config includes the SSL stuff from earlier, add it here:
                dialectOptions: production.dialectOptions || {} 
            }
        );
    }
    
    throw new Error("ENV variable must be set to 'development' or 'production'");
};

export const sequelize = sql_env()