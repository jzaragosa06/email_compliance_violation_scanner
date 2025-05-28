const { emailTransporter } = require("../config/transporter")

exports.sendAuthenticationInvitationEmail = async (email, emailSubject, emailBody, user) => {
    const transporter = emailTransporter();

    const mailOptions = {
        from: `"MailSiever" <${user.user_email}>`,
        to: email,
        subject: emailSubject,
        html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`mail options: ${mailOptions}. ----- response: ${info.response}`);
    return info.response;
}


