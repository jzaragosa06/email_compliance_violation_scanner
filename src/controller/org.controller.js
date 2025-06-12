const { analyzeOrgUserAccounts } = require("../services/analysis.service");
const { extractManagementId } = require("../services/management.service");
const { findOrgByDomain, findOrgByOrgId, findAllOrgs, addOrg, deleteOneOrgById, updateOrgInfo } = require("../services/org.service");
const { addOrgUserAccounts, deleteOneOrgUserAccounById, findAllAuthenticatedOrgUserAccount, cleanForNewOrgUserAccounts, updateAnalysisStartingDateFromAnalysisLogs, validateAccountsAnalysisStartingDate, findAllOrgUserAccounts, findOrgUserAccount } = require("../services/org_user_account.service");
const { findViolationsHistories } = require("../services/violations.service");

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
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.addOrg = async (req, res) => {
    //this involve adding into the Management first and then into the org
    const user_id = req.user.user_id; //we will extract the user_id from the token.

    const { org_domain, org_email, org_name, org_phone, org_description, org_employee_count, org_logo } = req.body;

    //we only require the org_domain, org_name
    if (!org_domain || !org_name) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    try {
        //check if domain already exist
        const org = await findOrgByDomain(org_domain);
        if (org) return res.status(409).json({ message: 'Org already exist. No two user can manage the same organization' }); 

        const result = await addOrg(user_id, org_domain, org_email, org_name, org_phone, org_description, org_employee_count, org_logo); 

        return res.status(201).json({ message: "New Organization Added", ...result })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }

}

//org user accounts
//we will require the emails to be in array format so that we don't have to create
//a separate controller for adding a single email. 
//we'll have an array of object {email: "", analysis_starting_date: ""}
exports.addOrgUserAccounts = async (req, res) => {
    console.log('user accounts body: ', JSON.stringify(req.body, null, 2));


    const { org_id } = req.params;
    const { user_id } = req.user;
    let { accounts } = req.body;

    if (!org_id || !accounts) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    //convert to array
    if (!Array.isArray(accounts)) {
        accounts = [accounts];
    }

    try {
        validateAccountsAnalysisStartingDate(accounts); 

        const emails = accounts.map(account => account.email);
        const uniqueEmails = [...new Set(emails)];

        const validEmails = await cleanForNewOrgUserAccounts(org_id, uniqueEmails);
        const validAccounts = accounts.filter(account => validEmails.includes(account.email));


        const result = await addOrgUserAccounts(org_id, user_id, validAccounts);
        res.status(201).json({ message: "Org user accounts added successfully", accounts: result });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.deleteOneOrgUserAccounById = async (req, res) => {
    const { org_user_account_id } = req.params;

    if (!org_user_account_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const org_user_account = await deleteOneOrgUserAccounById(org_user_account_id);

        return res.status(200).json({ message: "Organization user account deleted successfully", org_user_account });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.updateAnalysisStartingDate = async (req, res) => {
    const { org_user_account_id } = req.params;
    const { analysis_starting_date } = req.body;

    if (!org_user_account_id || !analysis_starting_date) {
        return req.status(400).json({ message: "The client sent a malformed or incomplete request" });
    }

    try {
        const analysisLog = await updateAnalysisStartingDateFromAnalysisLogs(org_user_account_id, analysis_starting_date);
        return res.status(200).json({ message: "Analysis starting date updated successfully", analysisLog })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update nalysis starting date", error: error.message });
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
        return res.status(200).json({ message: "Organization user account analyzed sucessfully", result });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.analyzeAllAuthenticatedOrgUserAccounts = async (req, res) => {
    const { org_id } = req.params;
    const { user_id } = req.user;

    if (!org_id || !user_id) {
        return res.status(400).json({
            message: "Missing required parameters"
        });
    }

    const org_user_accounts = await findAllAuthenticatedOrgUserAccount(org_id);

    const emails = org_user_accounts.map((org_user_account) => (org_user_account.email));

    try {
        const result = await analyzeOrgUserAccounts(org_id, emails);

        return res.status(200).json({ message: "Organization user account analyzed sucessfully", result });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


exports.updateOrgInfo = async (req, res) => {
    const { org_id } = req.params;

    if (!org_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    console.log('org_id: ', org_id);
    console.log('body', req.body);

    let { org_name, org_email, org_phone, org_description, org_employee_count, org_logo } = req.body;

    try {
        const employeeCount = org_employee_count ? parseInt(org_employee_count, 10) : null;
        if (org_employee_count && isNaN(employeeCount)) {
            return res.status(400).json({
                message: 'Invalid employee count value',
                error: 'Employee count must be a number'
            });
        }
        const orgInfo = await updateOrgInfo(org_id, org_name, org_email, org_phone, org_description, employeeCount, org_logo);
        return res.status(200).json({ message: "Organization info updated successfully", orgInfo });

    } catch (error) {
        console.log('error occured when updating: ', error.message);

        return res.status(500).json({ message: 'Failed to update organization info', error: error.message });

    }
}

exports.findOrgUserAccounts = async (req, res) => {
    const { org_id } = req.params;
    const { query } = req.query;

    try {
        if (query) {
            //search
            const org_user_accounts = await findOrgUserAccount(org_id, query);
            return res.status(200).json({ message: "Accounts retrieved successfully", accounts: org_user_accounts });
        }
        else {
            const org_user_accounts = await findAllOrgUserAccounts(org_id);
            return res.status(200).json({ message: "Accounts retrieved successfully", accounts: org_user_accounts });
        }
    } catch (error) {
        return res.status(200).json({ message: "Accounts failed to retrieved", error: error.message });
    }
}

exports.findViolationHistories = async (req, res) => {
    const { org_id } = req.params;

    if (!org_id) return res.status(400).json({ message: "Client sent a malformed request" });

    try {
        const management_id = await extractManagementId(org_id);
        const histories = await findViolationsHistories(management_id);
        
        return res.status(200).json({ message: "history retrieved successfully", histories })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to retrieve history", error: error.message });
    }
}