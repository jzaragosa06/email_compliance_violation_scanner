const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Admin = sequelize.define(
    "Admin",
    {
        admin_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        admin_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_contact_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_role: {
            type: DataTypes.STRING,
            allowNull: false,
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
    }
);

module.exports = Admin; 