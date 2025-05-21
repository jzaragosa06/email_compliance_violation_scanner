const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Policy = sequelize.define(
    "Policy",
    {
        org_email_policy_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        org_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: "orgs",
                key: "org_id",
            }
        }
    },
    {
        tableName: "org_email_policies",
        timestamps: false,
    }
);

module.exports = Policy; 