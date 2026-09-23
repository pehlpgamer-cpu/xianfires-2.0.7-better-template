import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

export default sequelize.define(
  "Role",
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    paranoid: true,
  },
);
