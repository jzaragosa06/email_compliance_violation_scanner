const { where } = require("sequelize")
const Policy = require("../models/org_email_policies.model")
const OrgInfo = require("../models/org_infos.model")
const OrgUserEmail = require("../models/org_user_emails.model")
const Org = require("../models/orgs.model");

const { v4: uuidv4 } = require("uuid");
const { sequelize, User } = require("../models");
const Management = require("../models/managements.model");

//functions
const findOrgByDomain = async (domain) => {
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
                    model: OrgUserEmail,
                }
            ]
        }
    )

    return org;
}

const getAllOrgs = async () => {
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

exports.getOrgByUserID = async (user_id) => {
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
                        model: OrgUserEmail,
                    }
                ]

            },
        ]
    });

    return org;
}


//we don't include the org user emails
exports.getOrgs = async (req, res) => {
    const { domain } = req.query;

    if (domain) {
        const org = await findOrgByDomain(domain);

        if (!org) return res.status(404).json({ message: "Organization Not Found" });

        return res.status(200).json({ message: "Retrieved Successfully", orgs });
    }
    else {
        const orgs = await getAllOrgs();
        return res.status(200).json({ message: "Retrieved Successfully", orgs });
    }


}

exports.getOrgByOrgId = async (req, res) => {
    const org_id = req.params.org_id;

    if (!org_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

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
                    model: OrgUserEmail,
                }
            ]
        }
    );

    if (!org) return res.status(404).json({ message: "Organization Not Found" });

    return res.status(200).json({ message: "Organization Found", org: org })
}

exports.addOrg = async (req, res) => {
    //this involve adding into the Management first and then into the org
    const user_id = req.user.user_id; //we will extract the user_id from the token.

    const { org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo } = req.body;

    //we only require the org_domain, org_name, org_trade_name
    if (!org_domain || !org_name || !org_trade_name) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
        return res.status(404).json({ message: "User associated with token not found." });
    }

    const org_id = uuidv4();
    const management_id = uuidv4();
    const org_email_policy_id = uuidv4();

    try {
        const result = await sequelize.transaction(async (t) => {
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

            return { management, org, orgInfo, policy }
        });

        return res.status(201).json({ message: "New Organization Added", ...result })

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}

