const cron = require("node-cron");
const { fetchActiveScheduledJob } = require("../services/management.service");
const { findAllAuthenticatedOrgUserAccount } = require("../services/org_user_account.service");
const { analyzeOrgUserAccounts } = require("../services/analysis.service");
const { generateEmailAnalysisReportEmail } = require("../utils/emails");
const { findOrgByOrgId } = require("../services/org.service");
const { findUserByUserId } = require("../services/user.service");
const { sendEmail } = require("../services/email.service");

const scheduledJobsMap = new Map();

exports.initializeEmailAnalysisJobs = async () => {
    const activeEmailSchedules = await fetchActiveScheduledJob();
    scheduleUserEmailJobs(activeEmailSchedules);
};

exports.reloadEmailAnalysisJobs = async () => {
    scheduledJobsMap.forEach((job, userId) => job.stop());
    scheduledJobsMap.clear();

    await this.initializeEmailAnalysisJobs();
};

const executeEmailAnalysisJob = async (userId, orgId, send_email) => {
    console.log(`date: ${Date()} executing email analysis job - userId: ${userId}, orgId: ${orgId}`);

    try {
        const org = await findOrgByOrgId(orgId);
        const user = await findUserByUserId(userId);
        const org_user_accounts = await findAllAuthenticatedOrgUserAccount(orgId);
        const emails = org_user_accounts.map((org_user_account) => (org_user_account.email));

        const { violationsCount } = await analyzeOrgUserAccounts(orgId, emails);

        //then send a summary to the user via email
        //send if send_email is enabled
        if (send_email) {
            const { emailSubject, emailBody } = generateEmailAnalysisReportEmail(violationsCount, org);
            await sendEmail(user.user_email, emailSubject, emailBody);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const scheduleUserEmailJobs = (emailSchedules) => {
    emailSchedules.forEach(schedule => {
        if (cron.validate(schedule.scheduled_expression)) {
            const job = cron.schedule(schedule.scheduled_expression, () =>
                executeEmailAnalysisJob(schedule.user_id, schedule.org_id, schedule.send_email)
            );

            job.start();
            scheduledJobsMap.set(schedule.user_id, job);
        } else {
            console.warn(`Invalid cron expression for userId: ${schedule.user_id}`);
        }
    });
};
