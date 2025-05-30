const { google } = require("googleapis")
require("dotenv").config();

exports.createOAuth2Client = (redirect) => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirect
    );
}