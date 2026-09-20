import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

const db = sequelize()

export const User = db.define("User", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  paranoid: true
});

