const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserInfo = sequelize.define(
    "UserInfo",
    {
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "user_infos",
        timestamps: false
    }
); 
module.exports = UserInfo;