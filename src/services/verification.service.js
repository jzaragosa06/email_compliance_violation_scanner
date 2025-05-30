const { Op } = require("sequelize");
const { UserInfo } = require("../models");
const { generateVerificationEmail } = require("../utils/emails");
const { sendEmail } = require("./email.service");
const crypto = require("crypto");

exports.createVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

exports.sendVerificationEmail = async (user, userInfo) => {
    const token = this.createVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token and expiry
    await UserInfo.update({
        verification_token: token,
        verification_token_expires: expires
    }, {
        where: { user_id: user.user_id }
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
    const { emailSubject, emailBody } = generateVerificationEmail(verificationUrl, userInfo);

    await sendEmail(user.user_email, emailSubject, emailBody);
};

exports.verifyEmail = async (token) => {
    const userInfo = await UserInfo.findOne({
        where: {
            verification_token: token,
            verification_token_expires: {
                [Op.gt]: new Date()
            },
            is_verified: false
        }
    });

    if (!userInfo) {
        throw new Error('Invalid or expired verification token');
    }

    await userInfo.update({
        is_verified: true,
        verification_token: null,
        verification_token_expires: null
    });

    return userInfo;
};