const { analyzeOrgUserAccounts } = require("../services/analysis.service");
const { findOrgByDomain, findOrgByOrgId, findAllOrgs, addOrg, deleteOneOrgById } = require("../services/org.service");
const { addOrgUserAccounts, deleteOneOrgUserAccounById, findAllAuthenticatedOrgUserAccount, cleanForNewOrgUserAccounts } = require("../services/org_user_account.service");

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

exports.deleteOneOrgById = async (req, res) => {
    const { org_id } = req.params;

    if (!org_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const org = await deleteOneOrgById(org_id);

        return res.status(200).json({ message: "Organization deleted successfully", org });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.addOrg = async (req, res) => {
    //this involve adding into the Management first and then into the org
    const user_id = req.user.user_id; //we will extract the user_id from the token.

    console.log('user_id', user_id);

    const { org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo } = req.body;

    //we only require the org_domain, org_name, org_trade_name
    if (!org_domain || !org_name || !org_trade_name) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    try {
        //check if domain already exist
        const org = await findOrgByDomain(org_domain);
        if (org) return res.status(409).json({ message: 'Org already exist. No two user can manage the same organization' }); 

        const result = await addOrg(user_id, org_domain, org_email, org_name, org_trade_name, org_phone, org_description, org_employee_count, org_logo); 

        return res.status(201).json({ message: "New Organization Added", ...result })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

//org user accounts
//we will require the emails to be in array format so that we don't have to create
//a separate controller for adding a single email. 
exports.addOrgUserAccounts = async (req, res) => {
    const { org_id } = req.params;
    const { user_id } = req.user;
    let { emails } = req.body;

    if (!org_id || !emails) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    //convert to array
    if (!Array.isArray(emails)) {
        emails = [emails];
    }

    //clean for duplicates. Set
    emails = [...new Set(emails)];
    emails = await cleanForNewOrgUserAccounts(org_id, emails); 


    try {
        const result = await addOrgUserAccounts(org_id, user_id, emails);
        res.status(201).json({ message: "Org user accounts added successfully", ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteOneOrgUserAccounById = async (req, res) => {
    const { org_user_account_id } = req.params;

    if (!org_user_account_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const org_user_account = await deleteOneOrgUserAccounById(org_user_account_id);

        return res.status(200).json({ message: "Organization user account deleted successfully", org_user_account });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.analyzeOrgUserAccounts = async (req, res) => {
    const { org_id } = req.params;
    const { user_id } = req.user;
    let { emails } = req.body;

    if (!org_id || !user_id || !emails) {
        return res.status(400).json({
            message: "Missing required parameters"
        });
    }

    // Convert to array if single email
    emails = Array.isArray(emails) ? emails : [emails];

    try {
        const result = await analyzeOrgUserAccounts(org_id, emails);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.analyzeAllAuthenticatedOrgUserAccounts = async (req, res) => {
    const { org_id } = req.params;

    const org_user_accounts = await findAllAuthenticatedOrgUserAccount(org_id);

    const emails = org_user_accounts.map((org_user_account) => (org_user_account.email));


    try {
        const result = await analyzeOrgUserAccounts(org_id, emails);

        return res.status(200).json({ message: "Organization user account analyzed sucessfully" }, result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
