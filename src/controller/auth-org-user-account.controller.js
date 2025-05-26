const { createOAuth2Client } = require("../config/gOAuth");
const { findOneOrgUserAccountsById, updateEmailAccoutAuthsRefreshToken } = require("../services/org_user_account.service");
const path = require("path");

exports.googleOAuthCallback = async (req, res) => {
    const { code, state, error } = req.query;

    if (error) return res.status(400).json({ message: 'OAuth authorization failed', details: error });

    if (!code || !state) return res.status(400).json({ message: "Missing authorization code or state" });

    try {
        const [org_user_account_id, expectedState] = state.split(':');

        const orgUserAccount = await findOneOrgUserAccountsById(org_user_account_id);

        if (!orgUserAccount) return res.status(404).json({ message: "Organization user account not found" });

        if (orgUserAccount.EmailAccountAuth.state != expectedState) return res.status(400).json({ message: "Invalid state parameter" });

        //exchange the code for token
        const oauth2client = await createOAuth2Client();
        const tokenResponse = await oauth2client.getToken(code);
        const tokens = tokenResponse.tokens;

        if (!tokens || !tokens.access_token) throw new Error("No access token receive from Google");

        //update the refresh token in the db
        const updated = await updateEmailAccoutAuthsRefreshToken(tokens.refresh_token, orgUserAccount.EmailAccountAuth.email_account_auth_id);

        // return res.status(200).json({
        //     success: true,
        //     message: "Email account successfully authorized",
        // });

        return res.sendFile(path.join(__dirname, "..", "public", "org-user-account-successful-auth.html"));
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Email account authorization failed",
            error: error
        });
    }
}