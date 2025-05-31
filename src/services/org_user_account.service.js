const { sequelize, OrgUserAccount, EmailAccountAuth, EmailAccountStatus, EmailAnalysisLog } = require("../models");
const { generateGoogleOAuthEmail } = require("../utils/emails");
const { generateState } = require("../utils/generateState");
const { generateUUIV4 } = require("../utils/generateUuidv4");
const { sendEmail } = require("./email.service");
const { generateOrgUserAuthURL } = require("./oauth.service");
const { findOrgByOrgId } = require("./org.service");
const { findUserByUserId } = require("./user.service");
const SCOPES = require("../config/googleOAuthScopes");
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow, isUtcDatetime } = require("../utils/dates");

exports.findOneOrgUserAccountsById = async (org_user_account_id) => {
    return await OrgUserAccount.findOne({
        where: { org_user_account_id: org_user_account_id },
        include: [
            {
                model: EmailAccountAuth,
            },
            {
                model: EmailAccountStatus,
            },
            {
                model: EmailAnalysisLog
            }
        ]
    });
}

exports.findOneOrgUserAccountsByEmailAndOrgId = async (org_id, email) => {
    return await OrgUserAccount.findOne({
        where: { org_id: org_id, email: email },
        include: [
            {
                model: EmailAccountAuth,
            },
            {
                model: EmailAccountStatus,
            },
            {
                model: EmailAnalysisLog
            }
        ]
    });
}

exports.findAllAuthenticatedOrgUserAccount = async (org_id) => {
    const org_user_accounts = await OrgUserAccount.findAll({
        where: { org_id: org_id },
        include: [
            {
                model: EmailAccountStatus,
                where: { is_authenticated: true },
                required: true
            }
        ]
    });

    return org_user_accounts;
}

exports.addOrgUserAccounts = async (org_id, user_id, accounts) => {
// Validate organization and user existence
    const org = await findOrgByOrgId(org_id);
    if (!org) throw new Error('Organization not found');

    const user = await findUserByUserId(user_id);
    if (!user) throw new Error('User not found');

    const results = [];

    for (const account of accounts) {
        const { email, analysis_starting_date } = account;

        try {
            // Pre-generate all UUIDs and state
            const org_user_account_id = generateUUIV4();
            const email_account_auth_id = generateUUIV4();
            const email_account_status_id = generateUUIV4();
            const analysis_log_id = generateUUIV4();
            const state = generateState();
            const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow(); 

            // Perform transactional creation of all related records
            const transactionResult = await sequelize.transaction(async (t) => {
                const org_user_account = await OrgUserAccount.create({
                    org_user_account_id,
                    org_id,
                    email,
                    created_at 
                }, { transaction: t, ignoreDuplicates: true });

                const email_account_auth = await EmailAccountAuth.create({
                    email_account_auth_id,
                    org_user_account_id,
                    state,
                    created_at,
                    updated_at,
                }, { transaction: t, ignoreDuplicates: true });

                const email_account_status = await EmailAccountStatus.create({
                    email_account_status_id,
                    org_user_account_id,
                    created_at,
                    updated_at
                }, { transaction: t, ignoreDuplicates: true });

                const email_analysis_log = await EmailAnalysisLog.create({
                    analysis_log_id,
                    org_user_account_id,
                    analysis_starting_date: analysis_starting_date ? analysis_starting_date : created_at,
                    created_at,
                    updated_at,
                }, { transaction: t, ignoreDuplicates: true });

                return {
                    org_user_account,
                    email_account_auth,
                    email_account_status,
                    email_analysis_log
                };
            });

            // Generate OAuth URL and email content
            const authUrl = await generateOrgUserAuthURL(org_user_account_id, state, SCOPES.ORG_USER_ACCOUNT);
            const { emailSubject, emailBody } = await generateGoogleOAuthEmail(authUrl, org, user);

            // Send the email
            await sendEmail(email, emailSubject, emailBody);

            results.push(transactionResult);
        } catch (error) {
            console.error(`Failed to add ${email}: ${error.message}`);
        }
    }

    return results;
};


exports.updateEmailAccoutAuthsRefreshToken = async (refresh_token, email_account_auth_id) => {
    return await EmailAccountAuth.update(
        {
            refresh_token: refresh_token,
            updated_at: getIsoUTCNow(),
        },
        { where: { email_account_auth_id: email_account_auth_id } });
}

exports.updateAuthenticatedStatus = async (org_user_account_id) => {
    return await EmailAccountStatus.update(
        {
            is_authenticated: 1,
            updated_at: getIsoUTCNow(),

        },
        { where: { org_user_account_id: org_user_account_id } }
    );
}

exports.deleteOneOrgUserAccounById = async (org_user_account_id) => {
    const org_user_account = await OrgUserAccount.findByPk(org_user_account_id);

    if (!org_user_account) throw new Error("Organization user account not found");

    return await org_user_account.destroy();
}

exports.cleanForNewOrgUserAccounts = async (org_id, emails) => {
    //this is an array of object: [{email}, {email}]
    const org_user_accounts = await OrgUserAccount.findAll({
        where: {
            org_id: org_id
        },
        attributes: ['email'],
        raw: true,
    });

    //we can convert this into an array and use .include() to check if email exist O(n)
    //or we can convert this into set and use the .has method for faster look up O(1)
    const existingEmails = new Set(org_user_accounts.map(acc => acc.email));

    //then filter for emails not in set
    const newEmails = emails.filter(email => !existingEmails.has(email));
    return newEmails;

}

exports.updateAnalysisStartingDateFromAnalysisLogs = async (org_user_account_id, analysis_starting_date) => {
    const analysisLog = await EmailAnalysisLog.findOne({
        where: {
            org_user_account_id: org_user_account_id
        }
    });

    if (!analysisLog) throw new Error("No analysis log found");

    analysisLog.set({
        analysis_starting_date: analysis_starting_date,
        updated_at: getIsoUTCNow(),
    });
    analysisLog.save();
    return analysisLog;
}

exports.validateAccountsAnalysisStartingDate = (accounts) => {
    for (const account of accounts) {
        if (!isUtcDatetime(account.analysis_starting_date)) {
            throw new Error("Invalid ISO UTC format");
        }
    }
}