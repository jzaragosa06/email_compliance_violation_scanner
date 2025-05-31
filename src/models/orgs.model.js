const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Org = sequelize.define(
    "Org",
    {
        org_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        org_domain: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: DataTypes.NOW(),
        },
    },
    {
        tableName: 'orgs',
        timestamps: false,
    }
)

module.exports = Org;