const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const EmailAccountAuth = sequelize.define(
    "EmailAccountAuth",
    {
        email_account_auth_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        org_user_account_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'org_user_accounts',
                key: 'org_user_account_id',
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'email_account_auth',
        timestamps: false,
    }
);

module.exports = EmailAccountAuth; 