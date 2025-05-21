const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserAuthProvider = sequelize.define(
    "UserAuthProvider",
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
        provider_user_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "user_auth_providers",
        timestamps: false,
    }
);

module.exports = UserAuthProvider;