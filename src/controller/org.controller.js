const { findOrgByDomain, findOrgByOrgId, findAllOrgs, addOrg } = require("../services/org.service");

//we don't include the org user emails
exports.findAllOrgs = async (req, res) => {
    const { domain } = req.query;

    if (domain) {
        const org = await findOrgByDomain(domain);

        if (!org) return res.status(404).json({ message: "Organization Not Found" });

        return res.status(200).json({ message: "Retrieved Successfully", org });
    }
    else {
        const orgs = await findAllOrgs();
        return res.status(200).json({ message: "Retrieved Successfully", orgs });
    }


}

exports.findOrgByOrgId = async (req, res) => {
    const org_id = req.params.org_id

    if (!org_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    const org = await findOrgByOrgId(org_id); 

    if (!org) return res.status(404).json({ message: "Organization Not Found" });

    return res.status(200).json({ message: "Organization Found", org: org })
}

exports.addOrg = async (req, res) => {
    //this involve adding into the Management first and then into the org
    const user_id = req.user.user_id; //we will extract the user_id from the token.

    console.log('user_id', user_id);

    const { org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo } = req.body;

    //we only require the org_domain, org_name, org_trade_name
    if (!org_domain || !org_name || !org_trade_name) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    // const existingUser = await findOrgByUserID(user_id);
    // if (!existingUser) {
    //     return res.status(404).json({ message: "User associated with token not found." });
    // }

    try {
        const result = await addOrg(user_id, org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo); 

        return res.status(201).json({ message: "New Organization Added", ...result })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}