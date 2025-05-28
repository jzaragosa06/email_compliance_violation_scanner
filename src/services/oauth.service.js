const { createOAuth2Client } = require("../config/gOAuth");
require("dotenv").config();


exports.generateAuthURL = async (org_user_account_id, state) => {
    const oauth2Client = await createOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl(
        {
            access_type: "offline",
            scope: [
                'https://www.googleapis.com/auth/gmail.readonly',
                // 'https://www.googleapis.com/auth/gmail.settings.basic',  
                // 'https://www.googleapis.com/auth/gmail.settings.sharing'
            ],
            state: `${org_user_account_id}:${state}`,
            prompt: 'consent',
        }
    );

    return authUrl;
}

exports.getAccessToken = async (refresh_token) => {
    const oauth2Client = await createOAuth2Client();

    //set the refresh token to target specific user account
    oauth2Client.setCredentials({
        refresh_token: refresh_token,
    });

    const { token } = await oauth2Client.getAccessToken();

    if (!token) throw new Error("Error getting an access token");

    return token;
}