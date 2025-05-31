const { google } = require("googleapis");
const { createOAuth2Client } = require("../config/gOAuth");
require('dotenv').config();

exports.createGmailClient = async (access_token, refresh_token) => {
    const oauth2Client = await createOAuth2Client(process.env.GOOGLE_ORG_USER_REDIRECT_URI);

    oauth2Client.setCredentials({
        access_token: access_token,
        refresh_token: refresh_token,
    });

    const gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
    return gmailClient;
}

exports.fetchEmailList = async (gmailClient, query, startDate) => {
    try {
        const formattedDate = new Date(startDate).toISOString().split('T')[0].replace(/-/g, '/');
        
        const res = await gmailClient.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: `${query} after:${formattedDate}`,
        });
        return res.data.messages || [];
    } catch (error) {
        console.error('Error fetching email list:', error);
        throw new Error(`Failed to fetch email list: ${error.message}`);
    }
};

exports.fetchEmailDetails = async (gmailClient, messageId) => {
    try {
        const res = await gmailClient.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full',
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching email details:', error);
        throw new Error(`Failed to fetch email details: ${error.message}`);
    }
};

// Parse email headers and body
exports.parseEmail = (email) => {
    const headers = extractHeaders(email.payload.headers);
    const body = extractBody(email.payload);
    const attachments = extractAttachment(email);

    return {
        ...headers,
        body,
        attachments
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

const extractAttachment = (email) => {
    if (!email.payload) return [];

    const attachments = [];

    // Function to process parts recursively
    const processPartsForAttachments = (part) => {
        // Check if part is an attachment
        if (part.body.attachmentId) {
            attachments.push({
                filename: part.filename,
                mimeType: part.mimeType,
                size: part.body.size,
                attachmentId: part.body.attachmentId
            });
        }

        // Recursively process nested parts
        if (part.parts) {
            part.parts.forEach(processPartsForAttachments);
        }
    };

    // Start processing from the main payload
    if (email.payload.parts) {
        email.payload.parts.forEach(processPartsForAttachments);
    }

    return attachments;
}

const decodeBase64 = (str) => {
    return Buffer.from(str, 'base64').toString('utf8');
};