const { createOAuth2Client } = require("../config/gOAuth");
require("dotenv").config();


exports.generateAuthURL = async (org_user_account_id, state) => {
    const oauth2Client = await createOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl(
        {
            access_type: "offline",
            scope: ['https://www.googleapis.com/auth/gmail.readonly'],
            state: `${org_user_account_id}:${state}`,
            prompt: 'consent',
        }
    );

    return authUrl;


}