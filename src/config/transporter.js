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

// exports.emailTransporter = () => {
//     return nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             type: 'OAUTH2',
//             user: process.env.GOOGLE_USER,
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             refreshToken: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
//         }
//     });
// }