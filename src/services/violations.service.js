const { EmailViolations, Management, OrgUserAccount, ViolationEvidence, sequelize } = require("../models");
const { generateUUIV4 } = require("../utils/generateUuidv4");

exports.findEmailViolationsByOrgId = async (org_id) => {
    return await Management.findOne(
        {
            where: {
                org_id: org_id,
            },
            include: [
                {
                    model: EmailViolations,
                    include: [
                        {
                            model: OrgUserAccount,
                        },
                        {
                            model: ViolationEvidence,
                        }
                    ]
                },
            ]
        }
    );
};

exports.findEmailViolationByOrgUserAccountId = async (org_user_account_id) => {
    return await OrgUserAccount.findByPk(org_user_account_id,
        {
            include: [
                {
                    model: EmailViolations,
                    include: [
                        {
                            model: ViolationEvidence,
                        }
                    ]
                }
            ]
        }
    )
}

exports.addEmailViolation = async (management_id, org_user_account_id, email_subject, evidence_tag) => {
    if (!management_id || !org_user_account_id) {
        throw new Error('Missing required parameters');
    }

    const email_violation_id = generateUUIV4();
    const evidence_id = generateUUIV4();

    try {
        return await sequelize.transaction(async (t) => {
            const email_violation = await EmailViolations.create(
                {
                    email_violation_id: email_violation_id,
                    management_id: management_id,
                    org_user_account_id: org_user_account_id,
                },
                { transaction: t }
            );
            const violation_evidence = await ViolationEvidence.create(
                {
                    evidence_id: evidence_id,
                    email_violation_id: email_violation_id,
                    email_subject: email_subject,
                    evidence_tag: evidence_tag,
                },
                { transaction: t }
            );

            return { email_violation, violation_evidence }
        })
    } catch (error) {
        throw new Error(`Failed to add email viollation: ${error.message}`)
    }
}