const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ViolationEvidence = sequelize.define(
    "ViolationEvidence",
    {
        evidence_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        email_violation_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'email_violations',
                key: 'email_violation_id',
            }
        },
        email_subject: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        evidence_tag: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "violation_evidences",
        timestamps: false,
    }
);

module.exports = ViolationEvidence; 