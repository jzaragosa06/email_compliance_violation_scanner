const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        org_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "users",
        timestamps: false,
    }
);

module.exports = User; 