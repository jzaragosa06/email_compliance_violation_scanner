const { emailTransporter } = require("../config/transporter");
require("dotenv").config(); 

exports.sendEmail = async (reciever, emailSubject, emailBody) => {
    const transporter = emailTransporter();

    const mailOptions = {
        from: `"MailSiever" <${process.env.GOOGLE_USER}>`,
        to: reciever,
        subject: emailSubject,
        html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`mail options: ${mailOptions}. ----- response: ${info.response}`);
    return info.response;
}
