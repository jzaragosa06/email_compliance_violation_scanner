const cron = require("node-cron");
const { fetchActiveScheduledJob } = require("../services/management.service");

const scheduledJobsMap = new Map();

exports.initializeEmailAnalysisJobs = async () => {
    const activeEmailSchedules = await fetchActiveScheduledJob();
    scheduleUserEmailJobs(activeEmailSchedules);
};

exports.reloadEmailAnalysisJobs = async () => {
    console.log('ç scheduled jobs ...........');


    scheduledJobsMap.forEach((job, userId) => job.stop());
    scheduledJobsMap.clear();

    await this.initializeEmailAnalysisJobs();
};

const executeEmailAnalysisJob = (userId, orgId) => {
    console.log(`date: ${Date()} executing email analysis job - userId: ${userId}, orgId: ${orgId}`);
};

const scheduleUserEmailJobs = (emailSchedules) => {
    emailSchedules.forEach(schedule => {
        if (cron.validate(schedule.scheduled_expression)) {
            const job = cron.schedule(schedule.scheduled_expression, () =>
                executeEmailAnalysisJob(schedule.user_id, schedule.org_id)
            );

            job.start();
            scheduledJobsMap.set(schedule.user_id, job);
        } else {
            console.warn(`Invalid cron expression for userId: ${schedule.user_id}`);
        }
    });
};
