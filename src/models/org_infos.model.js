const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const OrgInfo = sequelize.define(
    "OrgInfo",
    {
        org_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'orgs',
                key: 'org_id',
            }
        },
        org_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        org_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        org_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        org_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        org_employee_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        org_logo: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: "org_infos",
        timestamps: false,
    }
);

module.exports = OrgInfo;