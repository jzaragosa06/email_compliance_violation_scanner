const { where } = require("sequelize");
const { EmailViolations, Management, OrgUserAccount, ViolationEvidence, sequelize } = require("../models");
const { getIsoUTCNow } = require("../utils/dates");
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
    return await EmailViolations.findAll(
        {
            where: {
                org_user_account_id: org_user_account_id,
            },
            include: [
                {
                    model: ViolationEvidence,
                }
            ]
        }
    )
}


exports.addEmailViolation = async (management_id, org_user_account_id, analysis_run_at, email_subject, evidence_tag) => {
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
                    analysis_run_at: analysis_run_at, 
                    created_at: getIsoUTCNow(), 
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

exports.updateViolationStatus = async (email_violation_id, is_confirmed_violation) => {
    const emailViolation = await EmailViolations.findByPk(email_violation_id);

    if (!emailViolation) throw new Error('No email violation record found');

    emailViolation.set({
        is_confirmed_violation: is_confirmed_violation,
    });
    emailViolation.save();
    return emailViolation;
}

exports.findViolationsHistories = async (management_id) => {
    const histories = await EmailViolations.findAll({
        attributes: [
            'analysis_run_at',
            [sequelize.fn('COUNT', sequelize.col('analysis_run_at')), 'violationCount'],
        ],
        where: { management_id },
        group: ['analysis_run_at'],
        logging: console.log,
    });

    console.log('histories:', histories);


    return histories;
}