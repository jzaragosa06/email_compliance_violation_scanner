const { sequelize, OrgUserAccount, Org, OrgInfo, Policy, Management, ScheduledJob } = require("../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../utils/dates");

const { generateUUIV4 } = require("../utils/generateUuidv4");


exports.findOrgByDomain = async (org_domain) => {
    const org = await Org.findOne(
        {
            where: { org_domain: org_domain },
            include: [
                {
                    model: OrgInfo,
                },
                {
                    model: Policy,
                },
                {
                    model: OrgUserAccount,
                }
            ]
        }
    )

    return org;
}

exports.findAllOrgs = async () => {
    const orgs = await Org.findAll(
        {
            include: [
                {
                    model: OrgInfo,
                },
                {
                    model: Policy,
                }
            ]
        }
    )

    return orgs;
}

exports.findOrgsByUserID = async (user_id) => {
    const org = await Management.findAll({
        where: { user_id: user_id },
        include: [
            {
                model: Org,
                include: [
                    {
                        model: OrgInfo,
                    },
                    {
                        model: Policy,
                    },
                ]

            },
        ]
    });

    return org;
}

exports.findOrgByOrgId = async (org_id) => {
    const org = await Org.findOne(
        {
            where: { org_id: org_id },
            include: [
                {
                    model: OrgInfo,
                },
                {
                    model: Policy,
                },
                {
                    model: OrgUserAccount,
                }
            ]
        }
    );

    return org;
}

exports.deleteOneOrgById = async (org_id) => {
    const org = await Org.findByPk(org_id);

    if (!org) throw new Error("Organization not found");

    return await org.destroy();
}

exports.addOrg = async (user_id, org_domain, org_email, org_name, org_phone, org_description, org_employee_count, org_logo) => {

    const org_id = generateUUIV4();
    const management_id = generateUUIV4();
    const org_email_policy_id = generateUUIV4();
    const scheduled_job_id = generateUUIV4();
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow(); 


    return await sequelize.transaction(async (t) => {
        const org = await Org.create(
            {
                org_id: org_id,
                org_domain: org_domain,
                created_at: created_at, 
            },
            { transaction: t }
        );

        const management = await Management.create(
            {
                management_id: management_id,
                user_id: user_id,
                org_id: org_id,
                created_at: created_at,
            },
            { transaction: t }
        );

        const scheduledJob = await ScheduledJob.create(
            {
                scheduled_job_id: scheduled_job_id,
                management_id: management_id,
                created_at: created_at,
                updated_at: updated_at, 
            },
            { transaction: t }
        ); 

        const orgInfo = await OrgInfo.create(
            {
                org_id: org_id,
                org_name: org_name,
                org_email: org_email || null,
                org_phone: org_phone || null,
                org_description: org_description || null,
                org_employee_count: org_employee_count || null,
                org_logo: org_logo || null,
                created_at: created_at,
                updated_at: updated_at, 
            },
            { transaction: t }
        );

        const policy = await Policy.create(
            {
                org_email_policy_id: org_email_policy_id,
                org_id: org_id
            },
            { transaction: t }
        );

        return { management, org, orgInfo, policy, scheduledJob }
    });
}

exports.updateOrgInfo = async (org_id, org_name, org_email, org_phone, org_description, org_employee_count, org_logo) => {
    const orgInfo = await OrgInfo.findByPk(org_id);

    if (!orgInfo) throw new Error("No organization info found");

    try {
        orgInfo({
            org_name: org_name,
            org_email: org_email,
            org_phone: org_phone,
            org_description: org_description,
            org_employee_count: org_employee_count,
            org_logo: org_logo,
            updated_at: getIsoUTCNow(), 
        });
        orgInfo.save();
        return orgInfo;
    } catch (error) {
        throw new Error(error.message)
    }
}