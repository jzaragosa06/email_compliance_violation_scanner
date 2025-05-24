const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GoogleAuth = sequelize.define(
    "GoogleAuth",
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
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'google_auth',
        timestamps: false,
    }
)

module.exports = GoogleAuth; 