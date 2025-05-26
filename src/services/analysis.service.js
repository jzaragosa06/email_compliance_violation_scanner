const { createGmailClient } = require("./gmail.service");
const { getAccessToken } = require("./oauth.service");
const { findOneOrgUserAccountsByEmailAndOrgId } = require("./org_user_account.service");


exports.analyzeOrgUserAccounts = async (org_id, user_id, emails) => {
    for (const email of emails) {
        const org_user_account = await findOneOrgUserAccountsByEmailAndOrgId(org_id, email);

        const refresh_token = org_user_account.EmailAccountAuth.refresh_token;
        const access_token = await getAccessToken(refresh_token);

        const gmailClient = await createGmailClient(access_token, refresh_token);

        const messages = await this.getEmailList(gmailClient, 'in:inbox');

        for (const message of messages) {
            const rawEmail = await this.readEmail(gmailClient, message);
            const cleanedEmail = await this.extractEmailData(rawEmail);

            //then we will pass this on analysis
            await this.compareEmailAgainstPolicyRules(cleanedEmail, org_user_account)
        }
    }
}

//we will use this to get both the inbox and sent (q: 'in:inbox' or q: 'in:sent')
exports.getEmailList = async (gmailClient, q) => {
    const response = await gmailClient.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: q,
    });

    if (!response.data.messages || response.data.messages.length == 0) {
        throw new Error("An error occurred. No emails found");
    }

    const messages = response.data.messages;
    return messages;
}


//TODO: using id, read the email subjeckt, body, metadata
exports.readEmail = async (gmailClient, message) => {
    const emailData = await gmailClient.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
    });

    const email = emailData.data;
    return email;

}

exports.extractEmailData = (email) => {
    const headers = email.payload.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const to = headers.find(h => h.name === 'To')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    let body = '';
    if (email.payload.body && email.payload.body.data) {
        body = Buffer.from(email.payload.body.data, 'base64').toString();
    } else if (email.payload.parts) {
        for (const part of email.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                body += Buffer.from(part.body.data, 'base64').toString();
            }
        }
    }

    return {
        subject,
        from,
        to,
        date,
        body
    }
}

//TODO: function for analyis. this is where we pass the data, then we look for violation
exports.compareEmailAgainstPolicyRules = (email, org_user_account) => {

}

//TODO: function for adding the flagged user account and corresponding emails into the db. 
//we need to check if user account already exist in the email violations so as not to create a new instance
exports.addToEmailViolations = (violations, org_user_account) => {

}