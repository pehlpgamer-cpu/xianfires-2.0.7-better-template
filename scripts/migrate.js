import { Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";

// 🚨 CRITICAL: Import your models so they execute and register!
import "../app/models/Product.js"; 
import "../app/models/User.js"; 


// Helper function to create the database if it doesn't exist
async function ensureDatabaseExists() {
  const tempDb = new Sequelize(
    'mysql', 
    'root', 
    "mYNSn4qm6sgEez29agtW7dbfs7MG08YamNf8VPQfSaHxXssW26vXXa7drW3urJxn", 
    { host: "localhost", dialect: "mysql", logging: false }
  );

  try {
    await tempDb.query("CREATE DATABASE IF NOT EXISTS `xianfire-enhanced-database`;");
    console.log("✅ Database ensured!");
  } finally {
    await tempDb.close();
  }
}

try {
  console.log("⏳ Checking if database exists...");
  await ensureDatabaseExists();

  // Verify connection using the shared instance
  await sequelize.authenticate();
  console.log("✅ Connected to MySQL database!");

  // Verify models are registered
  console.log("Registered models:", Object.keys(sequelize.models)); 

  // Sync tables
  await sequelize.sync({ force: true }); 
  console.log("✅ Tables created for all models!");

} catch (err) {
  console.error("❌ Migration failed:", err);
} finally {
  process.exit();
}