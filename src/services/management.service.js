const { ScheduledJob, Management } = require("../models")
const cron = require('node-cron'); 
const { getIsoUTCNow } = require("../utils/dates");

exports.findScheduledJobByManagementId = async (management_id) => {
    const scheduled_job = await ScheduledJob.findOne({ where: { management_id: management_id } });

    if (!scheduled_job) throw new Error("No scheduled job found");

    return scheduled_job;
}


exports.validateScheduledExpression = (scheduled_expression) => {
    if (!cron.validate(scheduled_expression)) {
        throw new Error("Invalid node-cron expression");
    }
}

exports.updatedScheduledJob = async (management_id, scheduled_expression, is_active, send_email) => {
    let scheduled_job = await this.findScheduledJobByManagementId(management_id);

    if (!scheduled_job) throw new Error("No scheduled job found");

    await scheduled_job.set({
        scheduled_expression: scheduled_expression,
        is_active: is_active,
        send_email: send_email,
        updated_at: getIsoUTCNow(),
    }
    );
    await scheduled_job.save();
    return scheduled_job;
}


exports.updateRecievEmailReport = async (management_id, send_email) => {
    let scheduled_job = await this.findScheduledJobByManagementId(management_id);

    if (!scheduled_job) throw new Error("No scheduled job found");

    await scheduled_job.set({
        send_email: send_email,
        updated_at: getIsoUTCNow(),
    }
    );
    await scheduled_job.save();
    return scheduled_job;
}

exports.updateAutomateAnalysis = async (management_id, is_active) => {
    let scheduled_job = await this.findScheduledJobByManagementId(management_id);

    if (!scheduled_job) throw new Error("No scheduled job found");

    await scheduled_job.set({
        is_active: is_active,
        updated_at: getIsoUTCNow(),
    }
    );
    await scheduled_job.save();
    return scheduled_job;
}

exports.updatedScheduleExpression = async (management_id, scheduled_expression) => {
    let scheduled_job = await this.findScheduledJobByManagementId(management_id);

    if (!scheduled_job) throw new Error("No scheduled job found");

    await scheduled_job.set({
        scheduled_expression: scheduled_expression,
        updated_at: getIsoUTCNow(),
    }
    );
    await scheduled_job.save();
    return scheduled_job;
}

exports.findManagementByOrgId = async (org_id) => {
    return await Management.findOne({
        where: {
            org_id: org_id,
        }
    })
}



exports.fetchActiveScheduledJob = async () => {
    //fetch jobs with non null scheduled expression
    const activeScheduledJobs = await Management.findAll({
        attributes: ['management_id', 'user_id', 'org_id'],
        include: [
            {
                model: ScheduledJob,
                attributes: ['scheduled_expression', 'send_email'],
                where: {
                    is_active: true
                }
            }
        ]
    });

    const activeJobs = activeScheduledJobs.map((j) => ({
        user_id: j.user_id,
        org_id: j.org_id,
        management_id: j.management_id,
        scheduled_expression: j.ScheduledJob.scheduled_expression,
        send_email: j.ScheduledJob.send_email,
    }));

    console.log('activejobs', activeJobs);


    return activeJobs;
}

exports.extractManagementId = async (org_id) => {
    const management = await Management.findOne({ where: { org_id: org_id } });

    if (!management) throw new Error("No management found");

    return management.management_id;
}

// exports.fetchActiveScheduledJob = async () => {
//     const jobs = await Management.findAll({
//         attributes: [
//             'user_id',
//             'org_id',
//             'management_id',
//             [Sequelize.col('ScheduledJob.scheduled_expression'), 'scheduled_expression'],
//             [Sequelize.col('ScheduledJob.send_mail'), 'send_mail']
//         ],
//         include: [
//             {
//                 model: ScheduledJob,
//                 attributes: [], // prevent duplication
//                 where: {
//                     is_active: true
//                 },
//                 required: true
//             }
//         ],
//         raw: true
//     });

//     return jobs;
// };
