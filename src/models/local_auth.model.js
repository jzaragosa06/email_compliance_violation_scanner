const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LocalAuth = sequelize.define(
    "LocalAuth",
    {
        auth_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'user_auth',
                key: 'auth_id',
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'local_auth',
        timestamps: false,
    }
)

module.exports = LocalAuth; 