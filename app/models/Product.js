import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

const db = sequelize()
export const Product = db.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.DECIMAL, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false }
}, {
  paranoid: true // Moved to the options object
});