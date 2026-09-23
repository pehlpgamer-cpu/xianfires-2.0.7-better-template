import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";

//* WIP...
export default sequelize.define(
  "AuditTrail",
  {
    oldData: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    newData: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    paranoid: true,
  },
);
