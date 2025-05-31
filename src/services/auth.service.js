const { GoogleAuth } = require("../models");
const { generateUUIV4 } = require("../utils/generateUuidv4");
const { createUser, findUserByEmail } = require("./user.service");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerLocal = async (user_email, first_name, last_name, password, country, contact_number, job_title, privacy_consent_given) => {
    const user_id = generateUUIV4();
    const auth_id = generateUUIV4();
    const subscription_id = generateUUIV4();

    const userData = {
        user_id: user_id,
        user_email: user_email
    }

    const userInfoData = {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        country: country || null,
        contact_number: contact_number || null,
        job_title: job_title || null,
        privacy_consent_given: privacy_consent_given || null
    }

    const userAuthData = {
        auth_id: auth_id,
        user_id: user_id,
        provider_name: 'local',
    }

    const localAuthData = {
        auth_id: auth_id,
        password_hash: await bcryptjs.hash(password, 10)
    }

    const googleAuthData = {
        auth_id: auth_id,
    }

    const subscriptionData = {
        subscription_id: subscription_id,
        user_id: user_id,
        subscription_type: 'FREE',
    }

    return await createUser(userData, userInfoData, userAuthData, localAuthData, googleAuthData, subscriptionData)
}

exports.registerWithGoogle = async (user_email, first_name, last_name, refresh_token) => {
    const user_id = generateUUIV4();
    const auth_id = generateUUIV4();
    const subscription_id = generateUUIV4();

    const userData = {
        user_id: user_id,
        user_email: user_email
    }

    const userInfoData = {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        is_verified: true, 
    }

    const userAuthData = {
        auth_id: auth_id,
        user_id: user_id,
        provider_name: 'google',
    }

    const localAuthData = {
        auth_id: auth_id,
    }

    const googleAuthData = {
        auth_id: auth_id,
        refresh_token: refresh_token,
    }

    const subscriptionData = {
        subscription_id: subscription_id,
        user_id: user_id,
        subscription_type: 'FREE',
    }

    return await createUser(userData, userInfoData, userAuthData, localAuthData, googleAuthData, subscriptionData);
}

exports.checkLoginCredentials = async (user_email, password) => {
    const user = await findUserByEmail(user_email);
    if (user == null) {
        throw new Error('User not found');
    }

    const passwordMatch = await bcryptjs.compare(password, user.UserAuth.LocalAuth.password_hash)
    if (!passwordMatch) {
        throw new Error('Incorrect password');
    }

    return user;
}

exports.updateUserGoogleRefreshToken = async (auth_id, refresh_token) => {
    const googleAuth = await GoogleAuth.findByPk(auth_id);

    if (!googleAuth) throw new Error("Email account auth for google not found");

    googleAuth.set({
        refresh_token: refresh_token
    });
    googleAuth.save();
    return googleAuth;
}

//this is register with google
exports.handleRegister = async (userInfo, refreshToken) => {
    //check if it is existing
    const existingUser = await findUserByEmail(userInfo.email);
    if (existingUser) throw new Error("User already exist");

    return await this.registerWithGoogle(userInfo.email, userInfo.given_name, userInfo.family_name, refreshToken);
}

//this is login with google
exports.handleLogin = async (userInfo, refreshToken) => {
    const user = await findUserByEmail(userInfo.email);

    if (!user) throw new Error("User not found. Register first");

    if (refreshToken) {
        await this.updateUserGoogleRefreshToken(user.UserAuth.GoogleAuth.auth_id, refreshToken);
    }

    return user;
}

exports.generateJWTToken = (user) => {
    return jwt.sign({
        user_id: user.user_id,
        user_email: user.user_email,
    }, process.env.JWT_SECRET, { expiresIn: "10h" });
}
