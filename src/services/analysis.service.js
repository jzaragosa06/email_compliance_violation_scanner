const { createGmailClient, fetchEmailList, parseEmail, fetchEmailDetails } = require("./gmail.service");
const { findManagementByOrgId } = require("./management.service");
const { getAccessToken } = require("./oauth.service");
const { findOneOrgUserAccountsByEmailAndOrgId } = require("./org_user_account.service");
const VIOLATION_RULES = require("../config/violationRules");
const { addEmailViolation } = require("./violations.service");
const { EmailAnalysisLog } = require("../models");
const { getIsoUTCNow } = require("../utils/dates");

// Entry Point
exports.analyzeOrgUserAccounts = async (org_id, emails) => {
    if (!org_id || !emails) throw new Error("Invalid parameters");

    const management = await findManagementByOrgId(org_id);
    if (!management) throw new Error("Management not found");

    const withViolations = [];
    const withoutViolations = [];
    const withErrors = [];

    for (const email of emails) {
        try {
            const orgUserAccount = await findOneOrgUserAccountsByEmailAndOrgId(org_id, email);
            if (!orgUserAccount || !management || !orgUserAccount.EmailAccountAuth) throw new Error("No org / org user found or no auth");;

            const gmailClient = await createGmailClient(
                await getAccessToken(orgUserAccount.EmailAccountAuth.refresh_token),
                orgUserAccount.EmailAccountAuth.refresh_token
            );

            //fetch the start date of analysis
            const startDate = orgUserAccount.EmailAnalysisLog?.last_analyzed || orgUserAccount.EmailAnalysisLog.analysis_starting_date;

            if (!startDate) {
                throw new Error(`No valid analysis start date for email: ${email}`);
            }

            const messages = await fetchEmailList(gmailClient, 'in:inbox', startDate);

            console.log('messages: ', messages);


            for (const message of messages) {
                const rawEmail = await fetchEmailDetails(gmailClient, message.id);
                const parsedEmail = parseEmail(rawEmail);

                const violations = await compareEmailAgainstPolicyRules(parsedEmail);

                if (violations?.length) {
                    const result = await addEmailViolation(
                        management.management_id,
                        orgUserAccount.org_user_account_id,
                        parsedEmail.subject,
                        violations.map(v => v.type),
                    );
                    withViolations.push(result);
                }
                else {
                    withoutViolations.push({
                        email: parsedEmail.subject,
                    }); 
                }
            }

            await this.updateLastAnalyzedTimestamp(orgUserAccount.org_user_account_id); 

        } catch (error) {
            withErrors.push(
                {
                    email: email,
                    error: error.message
                }
            )
        }
    }

    return {
        withViolations,
        withoutViolations,
        withErrors,
        processedOrgUserAccountCount: emails.length,
        violationsCount: withViolations.length,
        withoutViolationsCount: withoutViolations.length,
        errorsCount: withErrors.length,
    };
};

// exports.updateLastAnalyzedTimestamp = async (org_user_account_id, transaction = null) => {
//     try {
//         const [updatedRows] = await EmailAnalysisLog.update(
//             {
//                 last_analyzed: getIsoUTCNow(),
//             },
//             {
//                 where: {
//                     org_user_account_id: org_user_account_id
//                 },
//                 returning: true, // Get the updated record
//                 transaction
//             }
//         );

//         if (updatedRows === 0) {
//             throw new Error(`No analysis log found for org user account: ${org_user_account_id}`);
//         }
//     } catch (error) {
//         console.error(`Failed to update last analyzed timestamp: ${error.message}`);
//         throw new Error(`Failed to update analysis timestamp: ${error.message}`);
//     }
// };

exports.updateLastAnalyzedTimestamp = async (org_user_account_id) => {
    const analysisLog = await EmailAnalysisLog.findOne({
        where: {
            org_user_account_id: org_user_account_id
        }
    });

    if (!analysisLog) throw new Error("No analysis log found");

    analysisLog.set({
        last_analyzed: getIsoUTCNow(),
    });
    analysisLog.save();
    return analysisLog;
};


//email has subject, from, to, date, and body, and attatchement (an array maybe);
const compareEmailAgainstPolicyRules = async (email) => {
    const violations = [];

    try {
        //check sensitive words
        const fullContent = `${email.subject} ${email.body}`;
        for (const pattern of VIOLATION_RULES.SENSITIVE_KEYWORDS.patterns) {
            const match = fullContent.match(pattern);
            if (match) {
                violations.push({
                    type: 'SENSITIVE_KEYWORDS',
                    rule: VIOLATION_RULES.SENSITIVE_KEYWORDS.name,
                    severity: VIOLATION_RULES.SENSITIVE_KEYWORDS.severity,
                    evidence: match[0],
                });
                break;
            }
        }

        //external recipeints
        for (const rule of VIOLATION_RULES.EXTERNAL_SHARING.patterns) {
            if (rule.test(fullContent)) {
                violations.push({
                    type: 'EXTERNAL_SHARING',
                    rule: VIOLATION_RULES.EXTERNAL_SHARING.name,
                    severity: VIOLATION_RULES.EXTERNAL_SHARING.severity,
                    evidence: "",
                });
                break;
            }
    }

        // //attatchement size violations
        if (email.attachments?.length > 0) {
            const largeAttachements = email.attachments.filter(
                att => att.size > VIOLATION_RULES.LARGE_ATTACHMENTS.maxSize
            );
            if (largeAttachements.length > 0) {
                violations.push({
                    type: 'LARGE_ATTACHMENTS',
                    rule: VIOLATION_RULES.LARGE_ATTACHMENTS.name,
                    severity: VIOLATION_RULES.LARGE_ATTACHMENTS.severity,
                    evidence: "",
                });
            }
        }

        // //phishing
        for (const pattern of VIOLATION_RULES.PHISHING_INDICATORS.patterns) {
            if (pattern.test(fullContent)) {
                violations.push({
                    type: 'PHISHING_INDICATORS',
                    rule: VIOLATION_RULES.PHISHING_INDICATORS.name,
                    severity: VIOLATION_RULES.PHISHING_INDICATORS.severity,
                    evidence: "",
                });
                break;
            }
        }

        // //company violations
        for (const pattern of VIOLATION_RULES.POLICY_VIOLATIONS.patterns) {
            if (pattern.test(fullContent)) {
                violations.push({
                    type: 'POLICY_VIOLATIONS',
                    rule: VIOLATION_RULES.POLICY_VIOLATIONS.name,
                    severity: VIOLATION_RULES.POLICY_VIOLATIONS.severity,
                    evidence: "",
                });
                break;
            }
        }
    } catch (error) {
        throw new Error(error.message)
    }

    return violations;

};


