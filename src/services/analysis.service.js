const { createGmailClient } = require("./gmail.service");
const { getAccessToken } = require("./oauth.service");
const { findOneOrgUserAccountsByEmailAndOrgId } = require("./org_user_account.service");

// Entry Point
exports.analyzeOrgUserAccounts = async (orgId, userId, emails) => {
    for (const email of emails) {
        try {
            const orgUserAccount = await findOneOrgUserAccountsByEmailAndOrgId(orgId, email);
            if (!orgUserAccount || !orgUserAccount.EmailAccountAuth) continue;

            const refreshToken = orgUserAccount.EmailAccountAuth.refresh_token;
            const accessToken = await getAccessToken(refreshToken);
            const gmailClient = await createGmailClient(accessToken, refreshToken);

            const messages = await fetchEmailList(gmailClient, 'in:inbox');

            for (const message of messages) {
                const rawEmail = await fetchEmailDetails(gmailClient, message.id);
                const parsedEmail = parseEmail(rawEmail);
                await analyzeEmail(parsedEmail, orgUserAccount);
            }
        } catch (error) {
            console.error(`Failed to process emails for: ${email}`, error);
        }
    }
};

// Fetch message list based on query
const fetchEmailList = async (gmailClient, query) => {
    const res = await gmailClient.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: query,
    });

    return res.data.messages || [];
};

// Fetch full message details
const fetchEmailDetails = async (gmailClient, messageId) => {
    const res = await gmailClient.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
    });

    return res.data;
};

// Parse email headers and body
const parseEmail = (email) => {
    const headers = extractHeaders(email.payload.headers);
    const body = extractBody(email.payload);

    return {
        ...headers,
        body
    };
};

const extractHeaders = (headers = []) => {
    const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
    return {
        subject: getHeader('Subject'),
        from: getHeader('From'),
        to: getHeader('To'),
        date: getHeader('Date'),
    };
};

const extractBody = (payload) => {
    if (payload.body?.data) {
        return decodeBase64(payload.body.data);
    }

    if (payload.parts) {
        return payload.parts
            .filter(part => part.mimeType === 'text/plain')
            .map(part => decodeBase64(part.body.data))
            .join('\n');
    }

    return '';
};

const decodeBase64 = (str) => {
    return Buffer.from(str, 'base64').toString('utf8');
};

// Email policy check
const analyzeEmail = async (email, orgUserAccount) => {
    // Placeholder logic
    const violations = await compareEmailAgainstPolicyRules(email, orgUserAccount);
    if (violations && violations.length > 0) {
        await addToEmailViolations(violations, orgUserAccount);
    }
};

// Placeholder for policy comparison
const compareEmailAgainstPolicyRules = async (email, orgUserAccount) => {
    // TODO: Implement rule checks
    return []; // Return array of violations
};

// Add to violation DB
const addToEmailViolations = async (violations, orgUserAccount) => {
    // TODO: Implement logic to store violations
};

