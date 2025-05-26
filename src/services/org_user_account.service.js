const { sequelize, OrgUserAccount, EmailAccountAuth, EmailAccountStatus, EmailAnalysisLog } = require("../models");
const { generateGoogleOAuthEmail } = require("../utils/emails");
const { generateState } = require("../utils/generateState");
const { generateUUIV4 } = require("../utils/generateUuidv4");
const { sendAuthenticationInvitationEmail } = require("./email.service");
const { generateAuthURL } = require("./oauth.service");
const { findOrgByOrgId } = require("./org.service");
const { findUserByUserId } = require("./user.service");

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

exports.addOrgUserAccounts = async (org_id, user_id, emails) => {
    const org = await findOrgByOrgId(org_id);
    const user = await findUserByUserId(user_id);

    if (!org) throw new Error('Organization not found');
    if (!user) throw new Error('User not found');

    //emails is an array of string. we can use the map to
    //create a array of object, each representing the data for manual insert. 
    //Data are consolidated first to ensure referential integrity of ids.

    //this will return a array of promises. Wrap to Promise.all to resolve them 
    //first before returning. 
    const emailDatas = await Promise.all(emails.map(async (email) => {
        const org_user_account_id = generateUUIV4();
        const state = generateState();

        //generate authurl
        const authUrl = await generateAuthURL(org_user_account_id, state);

        //generate email subject and body
        const { emailSubject, emailBody } = await generateGoogleOAuthEmail(authUrl, org, user);

        //then send an email
        //send authurl to the org_user_account using email
        await sendAuthenticationInvitationEmail(email, emailSubject, emailBody, user);

        return {
            org_user_account_id: org_user_account_id,
            org_id: org_id,
            email: email,
            email_account_auth_id: generateUUIV4(),
            state: state,
            analysis_log_id: generateUUIV4(),
            authUrl: authUrl
        }
    }));

    console.log('emaildatas: ', emailDatas);


    const org_user_account_data = emailDatas.map((emailData) => ({
        org_user_account_id: emailData.org_user_account_id,
        org_id: emailData.org_id,
        email: emailData.email,
    }));

    const email_account_auth_data = emailDatas.map((emailData) => ({
        email_account_auth_id: emailData.email_account_auth_id,
        org_user_account_id: emailData.org_user_account_id,
        state: emailData.state,
    }));

    const email_account_status_data = emailDatas.map((emailData) => ({
        email_account_status_id: emailData.email_account_status_id,
        org_user_account_id: emailData.org_user_account_id,
    }));

    const email_analysis_log_data = emailDatas.map((emailData) => ({
        analysis_log_id: emailData.analysis_log_id,
        org_user_account_id: emailData.org_user_account_id,
    }));

    return await sequelize.transaction(async (t) => {
        const org_user_account = await OrgUserAccount.bulkCreate(org_user_account_data, { transaction: t, ignoreDuplicates: true },);
        const email_account_auth = await EmailAccountAuth.bulkCreate(email_account_auth_data, { transaction: t, ignoreDuplicates: true });
        const email_account_status = await EmailAccountStatus.bulkCreate(email_account_status_data, { transaction: t, ignoreDuplicates: true });
        const email_analysis_log = await EmailAnalysisLog.bulkCreate(email_analysis_log_data, { transaction: t, ignoreDuplicates: true });

        return { org_user_account, email_account_auth, email_account_status, email_analysis_log };
    });
};

exports.updateEmailAccoutAuthsRefreshToken = async (refresh_token, email_account_auth_id) => {
    return await EmailAccountAuth.update(
        { refresh_token: refresh_token },
        { where: { email_account_auth_id: email_account_auth_id } });
}

exports.deleteOneOrgUserAccounById = async (org_user_account_id) => {
    const org_user_account = await OrgUserAccount.findByPk(org_user_account_id);

    if (!org_user_account) throw new Error("Organization user account not found");

    return await org_user_account.destroy();
}