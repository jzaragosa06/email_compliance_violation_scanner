const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmailAccountStatus = sequelize.define(
    "EmailAccountStatus",
    {
        email_account_status_id: {
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
        is_authenticated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    },
    {
        tableName: 'email_account_status',
        timestamps: false,
    }
);

module.exports = EmailAccountStatus; 