
import { sequelize } from "../app/models/db.js";
import inquirer from "inquirer";
import { mysqlConfig, defaultConfig } from "../configs/database.js";

const rootSequelize = mysqlConfig;
let dbName = null;
switch (process.env.DB_DIALECT)
{
  case "mysql":
    dbName = process.env.MYSQL_NAME || defaultConfig.mysql.name
  break;
  default:
    console.log("⚠️ " + process.env.DB_DIALECT + " is not a valid database dialect")
  break;
}

const { createDb } = await inquirer.prompt([
  {
    type: "confirm",
    name: "createDb",
    message: `Database '${dbName}' may not exist. Create it?`,
    default: true,
  },
]);

if (createDb) {
  await rootSequelize.query("CREATE DATABASE IF NOT EXISTS " + dbName);
  console.log("✅ Database created (if it did not exist)");
}

try {
  await sequelize.sync({ force: true });
  console.log("1. ✅ Tables created for all models!");

  await sequelize.authenticate();
  console.log("2. ✅ Connected to MySQL database!");
} catch (err) {
  console.error("❌ Migration failed:", err);
} finally {
  process.exit();
}
