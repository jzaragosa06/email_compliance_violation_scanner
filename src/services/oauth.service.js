const { createOAuth2Client } = require("../config/gOAuth");
require("dotenv").config();
const SCOPES = require("../config/googleOAuthScopes");
const OAuthState = require("../models/oauth_states.model");
const { generateState } = require("../utils/generateState");
const { generateUUIV4 } = require("../utils/generateUuidv4");


//this is for org user account
exports.generateOrgUserAuthURL = async (id, state, scopes) => {
    const oauth2Client = await createOAuth2Client(process.env.GOOGLE_ORG_USER_REDIRECT_URI);

    const authUrl = oauth2Client.generateAuthUrl(
        {
            access_type: "offline",
            scope: scopes,
            state: `${id}:${state}`,
            prompt: 'consent',
        }
    );

    return authUrl;
}

exports.generateUserAuthURL = async (user_id, type) => {
    const oauth2Client = await createOAuth2Client(process.env.GOOGLE_USER_REDIRECT_URI);
    const state = generateState();

    const scopes = SCOPES[type.toUpperCase()];

    await OAuthState.create({
        state_id: generateUUIV4(),
        state: state,
        user_id: user_id,
        type: type,
        expires_at: new Date(Date.now() + 3600000),
    })

    const authUrl = oauth2Client.generateAuthUrl(
        {
            access_type: "offline",
            scope: scopes,
            state: state, 
            prompt: 'consent',
        }
    );

    return authUrl;
}

exports.verifyState = async (state) => {
    const storedState = await OAuthState.findOne(
        {
            where: {
                state: state,
            }
        }
    );

    if (!storedState) throw new Error("Invalid state parameter");

    return storedState;
}

exports.getAccessToken = async (refresh_token) => {
    const oauth2Client = await createOAuth2Client(process.env.GOOGLE_ORG_USER_REDIRECT_URI);

    //set the refresh token to target specific user account
    oauth2Client.setCredentials({
        refresh_token: refresh_token,
    });

    const { token } = await oauth2Client.getAccessToken();

    if (!token) throw new Error("Error getting an access token");

    return token;
}