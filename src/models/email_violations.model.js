const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmailViolations = sequelize.define(
    "EmailViolations",
    {
        email_violation_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        management_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'managements',
                key: 'management_id',
            }
        },
        org_user_account_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'org_user_accounts',
                key: 'org_user_account_id',
            }
        },
        is_confirmed_violation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        reviewed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        analysis_run_id: {
            type: DataTypes.STRING(36), //for counting the freq. of v. per run
            allowNull: false
        }, 
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'email_violations',
        timestamps: false,
    }
);

module.exports = EmailViolations; 