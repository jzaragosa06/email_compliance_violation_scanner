const { User, UserInfo, UserAuthProvider } = require("../models");
const { createUser, getUserByEmail } = require("./user.controller");
const { user } = require("./user.controller");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.registerLocal = async (req, res) => {
    const user_id = uuidv4();
    const auth_id = uuidv4();
    const org_id = uuidv4();
    const subscription_id = uuidv4(); 

    const { user_email, first_name, last_name, password } = req.body;

    if (user_email == null || first_name == null || last_name == null || password == null) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    const existingUser = await getUserByEmail(user_email);
    if (existingUser) {
        return res.status(409).json({ message: "Email already in used" });
    }

    try {
        const userData = {
            user_id: user_id,
            org_id: org_id,
            user_email: user_email
        }

        const userInfoData = {
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
        }

        const auth_providerData = {
            auth_id: auth_id,
            user_id: user_id,
            provider_name: 'local',
            password_hash: await bcryptjs.hash(password, 10)
        }

        const subscriptionData = {
            subscription_id: subscription_id,
            user_id: user_id,
            subscription_type: 'FREE',
        }

        const { user, userInfo, auth_provider, subscription } = await createUser(userData, userInfoData, auth_providerData, subscriptionData)

        return res.status(201).json({ message: "New user created.", user, userInfo, auth_provider, subscription })

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

exports.loginLocal = async (req, res) => {
    const { user_email, password } = req.body;

    if (user_email == null || password == null) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    const user = await getUserByEmail(user_email);
    if (user == null) {
        return res.status(404).json({ message: "User Not Found" });
    }

    const passwordMatch = await bcryptjs.compare(password, user.UserAuthProvider.password_hash)
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect user password' });
    }

    const token = jwt.sign({
        user_id: user.user_id,
        org_id: user.org_id,
        user_email: user.user_email,
        first_name: user.UserInfo.first_name,
        last_name: user.UserInfo.last_name,
    },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    );

    return res.status(200).json({ message: "Login successfully", token: token })
}

