import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/database.js";

class User extends Model {
    static associate(models) {
        User.belongsTo(models.Role);
    }
}

export default User.init
(
    {
        UserId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        paranoid: true,
        modelName: "User",
        tableName: "users",
    }
);
