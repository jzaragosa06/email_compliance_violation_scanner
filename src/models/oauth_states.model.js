const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const OAuthState = sequelize.define(
    "OAuthState",
    {
        state_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,

        },
        type: {
            type: DataTypes.ENUM('register', 'login'),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'oauth_states',
        timestamps: false,
    }

);

module.exports = OAuthState; 