require('dotenv').config();
const nodemailer = require('nodemailer');

exports.emailTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_APP_PASSWORD,
        }
    });
}