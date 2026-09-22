import { Sequelize } from "sequelize";
import { styleText } from "node:util";
import { development, production } from "../../config/database.js";
import { sequelize } from "../../database/database.js";

// 🚨 CRITICAL: Import your models so they execute and register!
import "../../app/models/Product.js"; 
import "../../app/models/User.js"; 


// Helper function to create the database if it doesn't exist
async function ensureDatabaseExists() {


    let tempDb;

    switch (process.env.ENV)
    {
        case 'development':
            tempDb = new Sequelize(
                'mysql', 
                development.username, 
                development.password, 
                { 
                    host: development.host, 
                    dialect: development.dialect, 
                    logging: false 
                }
            );
        break;
        case 'production':
            tempDb = new Sequelize(
                'mysql', 
                production.username, 
                production.password, 
                { 
                    host: production.host, 
                    dialect: production.dialect, 
                    logging: false 
                }
            );
        break;
        default:
            console.error("INVALID ENV VALUE")
        break;
    } 

    try {
        const databaseName = sequelize.config.database;

        const quotedDatabaseName =
        sequelize.getQueryInterface().quoteIdentifier(databaseName);

        await tempDb.query(`CREATE DATABASE IF NOT EXISTS ${quotedDatabaseName};`);
        console.log("✅ Database ensured!");
    } finally {
        await tempDb.close();
    }
}


export async function migrationCommand(sequelize, type)
{

    try {
        console.log("⏳ Checking if database exists...");
        await ensureDatabaseExists();
    
        // Verify connection using the shared instance
        await sequelize.authenticate();
        console.log("✅ Connected to MySQL database!");
    
        // Verify models are registered
        console.log("Registered models:", Object.keys(sequelize.models)); 
    
        if (type === "migrate")
        {
            await sequelize.sync(); 
            console.log("✅ Created all tables that doesn't exist");
        }
        else if (type === "fresh")
        {
            await sequelize.sync({ force: true });
            console.log(styleText("red","🗑️ Tables dropped for all models!")); 
            console.log(styleText("green","✅ Tables created for all models"));
        }
        else if (type === "drop")
        {
            await sequelize.drop();
            console.log(styleText("red","🗑️ Tables dropped for all models!")); 
        }
    
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } 
    finally {
        process.exit();
    }

}
