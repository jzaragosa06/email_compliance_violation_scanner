const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrgUserEmail = sequelize.define(
    "OrgUserEmail",
    {
        org_user_email_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        org_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'orgs',
                key: 'org_id',
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        created_at: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: DataTypes.NOW(),
        },
        updated_at: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: DataTypes.NOW(),
        },
    },
    {
        tableName: 'org_user_emails',
        timestamps: false,
    }
);

module.exports = OrgUserEmail;