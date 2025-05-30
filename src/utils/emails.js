exports.generateGoogleOAuthEmail = (authUrl, org, user) => {
  // Brand colors
  const mainColor = '#FE7743';       // Orange (primary brand color)
  const secondaryColor = '#273F4F';  // Retro (background/accent)
  const backgroundColor = '#EFEEEA'; // White (light background)
  const textColor = '#000000';       // Black (main text)

  const emailSubject = `You're Invited to Secure Your Email Access with ${org.OrgInfo.org_name}`;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; background-color: ${backgroundColor}; color: ${textColor}; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <div style="background-color: ${secondaryColor}; color: white; padding: 24px 32px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
          <h2 style="margin: 0;">Hello ${user.UserInfo.first_name} ${user.UserInfo.last_name},</h2>
        </div>

        <div style="padding: 24px 32px;">
          <p>You've been added to <strong>${org.OrgInfo.org_name}</strong> as part of an effort to enhance email compliance and security across the organization.</p>

          <p><strong>MailSiever</strong> is our trusted email policy compliance scanner. It analyzes account activity to ensure your email usage aligns with company policies and protects sensitive data.</p>

          <p style="margin-top: 24px;">To begin, please click the button below to authenticate your email account:</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${authUrl}" style="
              background-color: ${mainColor};
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              border-radius: 8px;
              display: inline-block;
            ">
              Authenticate Now
            </a>
          </div>

          <p>If you have any questions or concerns, feel free to reach out to your IT administrator.</p>
        </div>

        ${exports.generateEmailSignature(mainColor, secondaryColor)}
      </div>
    </div>
  `;

  return { emailSubject, emailBody };
};

exports.generateEmailSignature = (mainColor = '#FE7743', linkColor = '#273F4F') => {
  return `
    <div style="padding: 24px 32px; border-top: 1px solid #ddd; background-color: #F8F8F8; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
      <div style="font-size: 14px; color: #555;">
        <p style="margin: 0;"><strong>MailSiever Compliance Team</strong></p>
        <p style="margin: 4px 0;">Security & Compliance Department</p>
        <p style="margin: 4px 0;">📧 mailsiever@gmail.com | 🌐 
          <a href="https://mailsiever.com" style="color: ${linkColor}; text-decoration: none;">mailsiever.com</a>
        </p>
        <p style="margin: 4px 0;">📞 +1 (555) 123-4567</p>
        <p style="margin-top: 12px; font-style: italic; color: ${mainColor};">"Securing trust, one email at a time."</p>
      </div>
    </div>
  `;
};


exports.generateEmailAnalysisReportEmail = (violationsCount, org) => {
  // Brand colors
  const mainColor = '#FE7743';       // Orange
  const secondaryColor = '#273F4F';  // Dark Blue
  const backgroundColor = '#EFEEEA'; // Light background
  const textColor = '#000000';       // Black

  const emailSubject = `Email Analysis Report for ${org.OrgInfo.org_name}`;

  const emailBody = `
    <div style="font-family: Arial, sans-serif; background-color: ${backgroundColor}; color: ${textColor}; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">

        <!-- Header -->
        <div style="background-color: ${secondaryColor}; color: white; padding: 24px 32px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
          <h2 style="margin: 0;">Email Policy Analysis Summary</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px 32px; font-size: 15px; line-height: 1.6;">
          <p>Hello,</p>

          <p>Here is your email policy compliance summary for the organization:</p>

          <div style="background-color: #F4F4F4; border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
            <strong>Organization:</strong> ${org.OrgInfo.org_name}<br>
            <strong>Domain:</strong> ${org.org_domain}
          </div>

          ${violationsCount === 0
      ? `<p style="color: green;"><strong>No violations detected.</strong> Great job maintaining email policy compliance!</p>`
      : `
                <p style="color: #D32F2F;"><strong>${violationsCount} potential policy violation(s) detected.</strong></p>
                <p>Please visit your compliance dashboard to review and address the issues.</p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://mailsiever.com/dashboard" style="
                    background-color: ${mainColor};
                    color: white;
                    padding: 14px 28px;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    display: inline-block;
                  ">
                    Review Violations
                  </a>
                </div>
              `
    }

          <p>If you have any questions or believe this report is inaccurate, please reach out to your IT administrator.</p>
        </div>

        <!-- Signature -->
        ${exports.generateEmailSignature(mainColor, secondaryColor)}

      </div>
    </div>
  `;

  return { emailSubject, emailBody };
};


exports.generateVerificationEmail = (verificationUrl, user) => {
  const emailSubject = "Verify Your MailSiever Account";
  const mainColor = '#FE7743';
  const secondaryColor = '#273F4F';

  const emailBody = `
    <div style="background-color: #EFEEEA; padding: 40px 0; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: ${secondaryColor}; color: white; padding: 24px 32px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
                <h2 style="margin: 0;">Welcome to MailSiever!</h2>
            </div>

            <div style="padding: 24px 32px;">
                <p>Hello ${user.first_name} ${user.last_name},</p>

                <p>Thank you for registering with MailSiever. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="${verificationUrl}" style="
                        background-color: ${mainColor};
                        color: white;
                        padding: 14px 28px;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: bold;
                        border-radius: 8px;
                        display: inline-block;">
                        Verify Email Address
                    </a>
                </div>

                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with us, please ignore this email.</p>
            </div>

            ${exports.generateEmailSignature(mainColor, secondaryColor)}
        </div>
    </div>`;

  return { emailSubject, emailBody };
};