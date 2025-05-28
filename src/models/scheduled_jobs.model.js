const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const ScheduledJob = sequelize.define(
    "ScheduledJob",
    {
        scheduled_job_id: {
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
        scheduled_expression: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        send_email: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        tableName: 'scheduled_jobs',
        timestamps: false,
    }
);

module.exports = ScheduledJob; 