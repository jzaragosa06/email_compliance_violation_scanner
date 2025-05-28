const { sequelize, OrgUserAccount, Org, OrgInfo, Policy, Management, ScheduledJob } = require("../models");

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

exports.findOrgByUserID = async (user_id) => {
    const org = await Management.findOne({
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
                    {
                        model: OrgUserAccount,
                    }
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

exports.addOrg = async (user_id, org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo) => {

    const org_id = generateUUIV4();
    const management_id = generateUUIV4();
    const org_email_policy_id = generateUUIV4();
    const scheduled_job_id = generateUUIV4();


    return await sequelize.transaction(async (t) => {
        const org = await Org.create(
            {
                org_id: org_id,
                org_domain: org_domain,
            },
            { transaction: t }
        );

        console.log('org', org);


        const management = await Management.create(
            {
                management_id: management_id,
                user_id: user_id,
                org_id: org_id,
            },
            { transaction: t }
        );

        const scheduledJob = await ScheduledJob.create(
            {
                scheduled_job_id: scheduled_job_id,
                management_id: management_id,
            },
            { transaction: t }
        ); 

        const orgInfo = await OrgInfo.create(
            {
                org_id: org_id,
                org_name: org_name,
                org_trade_name: org_trade_name,
                org_email: org_email || null,
                org_phone: org_phone || null,
                org_description: org_description || null,
                org_employee_count: org_employee_count || null,
                org_logo: org_logo || null,
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