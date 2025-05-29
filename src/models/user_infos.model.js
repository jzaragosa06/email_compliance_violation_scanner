const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserInfo = sequelize.define(
    "UserInfo",
    {
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        privacy_consent_given: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }, 
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "user_infos",
        timestamps: false
    }
); 
module.exports = UserInfo;