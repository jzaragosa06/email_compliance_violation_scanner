const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserAuth = sequelize.define(
    "UserAuth",
    {
        auth_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        provider_name: {
            type: DataTypes.ENUM('local', 'google'),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "user_auth",
        timestamps: false,
    }
);

module.exports = UserAuth;