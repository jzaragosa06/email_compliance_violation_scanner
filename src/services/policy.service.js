const { Op } = require("sequelize");
const { Policy } = require("../models");
const { generateUUIV4 } = require("../utils/generateUuidv4");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../utils/dates");

exports.findAllPolicies = async (org_id) => {
    const policies = await Policy.findAll({
        where: {
            org_id: org_id
        }
    });

    return policies;
}

exports.findPolicy = async (org_id, query) => {
    const policies = await Policy.findAll({
        where: {
            org_id: {
                [Op.eq]: org_id,
            },
            pattern: {
                [Op.like]: `%${query}%`,
            }

        }
    });

    return policies;
}

exports.addPolicy = async (org_id, pattern) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();
    const policy = await Policy.create({
        org_email_policy_id: generateUUIV4(),
        org_id,
        pattern,
        created_at,
        updated_at,
    });

    return policy;
}

exports.deletePolicy = async (org_email_policy_id) => {
    const policy = await Policy.findByPk(org_email_policy_id);

    if (!policy) throw new Error('No policy found');

    policy.destroy();
    return policy;
}

exports.updatePolicy = async (org_email_policy_id, pattern) => {
    const policy = await Policy.findByPk(org_email_policy_id);

    if (!policy) throw new Error("No policy found");

    policy.set({
        pattern: pattern,
        updated_at: getIsoUTCNow(),
    });

    policy.save();
    return policy;
}