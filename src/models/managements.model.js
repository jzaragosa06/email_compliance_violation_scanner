const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Management = sequelize.define(
    "Management",
    {
        management_id: {
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
            }
        },
        org_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'orgs',
                key: 'org_id',
            }
        }, created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'managements',
        timestamps: false,
    }
);

module.exports = Management; 