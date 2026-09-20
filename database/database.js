import { Sequelize } from "sequelize";
import { development, production } from '../config/database.js';

import 'dotenv/config'


const sql_env = () => {
    if (process.env.ENV === 'development') {
        return new Sequelize(
            development.database, 
            development.username, 
            development.password, 
            {
                host: development.host,
                dialect: development.dialect
            }
        );
    } 
    else if (process.env.ENV === 'production') {
        return new Sequelize(
            production.database, 
            production.username, 
            production.password,          
            {
                host: production.host,
                dialect: production.dialect,
                dialectOptions: production.dialectOptions || {} 
            }
        );
    }
    
    throw new Error("ENV variable must be set to 'development' or 'production'");
};

export const sequelize = sql_env()