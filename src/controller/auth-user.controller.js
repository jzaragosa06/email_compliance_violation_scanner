require("dotenv").config();

const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../services/user.service");
const { registerLocal, checkLoginCredentials, handleRegister, generateJWTToken, handleLogin } = require("../services/auth.service");
const { generateUUIV4 } = require("../utils/generateUuidv4");
const { generateUserAuthURL, verifyState } = require("../services/oauth.service");
const { createOAuth2Client } = require("../config/gOAuth");
const { google } = require("googleapis");
const { sendVerificationEmail, verifyEmail } = require("../services/verification.service");
require("dotenv").config(); 
const path = require("path"); 

exports.registerLocal = async (req, res) => {
    const {
        user_email,
        first_name,
        last_name,
        password,
        country,
        contact_number,
        job_title,
        privacy_consent_given
    } = req.body;

    console.log('body', JSON.stringify(req.body, null, 2));


    if (!user_email || !first_name || !last_name || !password) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    const existingUser = await findUserByEmail(user_email);
    if (existingUser) {
        return res.status(409).json({ message: "Email already in used" });
    }

    try {
        const result = await registerLocal(user_email, first_name, last_name, password, country, contact_number, job_title, privacy_consent_given); 

        //send verificaiton email. We'll only do this for registering using email. 
        await sendVerificationEmail(result.user, result.userInfo);

        return res.status(201).json({ message: "New user created. Please check your email to verify your account.", ...result })

    } catch (error) {
        return res.status(500).json({ message: 'Failed to register', error: error.message });

    }
}

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
    }

    try {
        const userInfo = await verifyEmail(token);
        // return res.status(200).json({
        //     message: "Email verified successfully",
        //     user_id: userInfo.user_id
        // });
        return res.sendFile(path.join(__dirname, "..", "public", "verified.html"));

    } catch (error) {
        return res.status(400).json({
            message: "Email verification failed",
            error: error.message
        });
    }
};


exports.loginLocal = async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    try {
        const user = await checkLoginCredentials(user_email, password);

        // if (!user.UserInfo.is_verified) {
        //     return res.status(403).json({ message: "Please verify your email before logging in." });
        // }

        const token = jwt.sign({
            user_id: user.user_id,
            user_email: user.user_email,
        },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ message: "Login successfully", token: token });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to login', error: error.message })
    }
}

exports.googleAuth = async (req, res) => {
    const { type } = req.params;

    if (!['register', 'login'].includes(type)) return res.status(400).json({ message: 'Invalid auth type' });

    try {
        const user_id = generateUUIV4();
        const authUrl = await generateUserAuthURL(user_id, type);
        return res.status(200).json({ message: "Auth Url created successfully", authUrl });
    } catch (error) {
        return res.status(500).json({ message: "Failed to generate auth URL", error: error.message });
    }
}

exports.googleUserOAuthCallback = async (req, res) => {
    const { code, state, error } = req.query;

    if (error) return res.status(400).json({ message: 'OAuth authorization failed', details: error });
    if (!code || !state) return res.status(400).json({ message: "Missing authorization code or state" });

    try {
        const storedState = await verifyState(state);
        const oauth2Client = await createOAuth2Client(process.env.GOOGLE_USER_REDIRECT_URI);
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens || !tokens.access_token) {
            throw new Error("No access token received from Google");
        }

        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: oauth2Client, version: 'v2',
        });
        const userInfo = await oauth2.userinfo.get();

        if (storedState.type == "register") {
            const { user } = await handleRegister(userInfo.data, tokens.refresh_token);
            console.log('user: ', user);

            const token = generateJWTToken(user);
            const responseData = JSON.stringify({ message: "Registered Successfully", token });

            return res.redirect(`${process.env.VITE_FRONTEND_URL}/auth/google/callback?response=${encodeURIComponent(responseData)}`);
            // return res.status(201).json({ message: "Registered Successfully", token });
        }
        else {
            const user = await handleLogin(userInfo.data, tokens.refresh_token);
            const token = generateJWTToken(user);
            const responseData = JSON.stringify({ message: "Login Successfully", token });

            return res.redirect(`${process.env.VITE_FRONTEND_URL}/auth/google/callback?response=${encodeURIComponent(responseData)}`);

            // return res.status(200).json({ message: "Login Successfully", token });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Authentication failed",
            error: error.message
        });
    }
}