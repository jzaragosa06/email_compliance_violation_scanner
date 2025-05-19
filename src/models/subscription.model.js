const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Subscription = sequelize.define(
    "Subscription",
    {
        subscription_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            }
        },
        subscription_type: {
            type: DataTypes.ENUM('FREE', 'BASIC', 'STANDARD', 'PREMIUM'),
            allowNull: false,
            defaultValue: 'FREE',
        }
    },
    {
        tableName: 'subscriptions',
        timestamps: false,
    }
);

module.exports = Subscription; 