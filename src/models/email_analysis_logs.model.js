const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const EmailAnalysisLog = sequelize.define(
    "EmailAnalysisLog",
    {
        analysis_log_id: {
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
        last_analyzed: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        tableName: 'email_analysis_logs',
        timestamps: false,
    }
);

module.exports = EmailAnalysisLog; 