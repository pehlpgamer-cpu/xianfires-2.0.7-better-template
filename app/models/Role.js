import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/database.js";

class Role extends Model {
    static associate(models) {
        Role.hasMany(models.User);
    }
}

export default Role.init(
    {
        roleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        paranoid: true,
        sequelize,
        modelName: "Role",
        tableName: "roles",
    }
);

