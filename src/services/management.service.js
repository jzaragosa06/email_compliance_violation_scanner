const { ScheduledJob, Management } = require("../models")
const { Sequelize } = require("sequelize");
const cron = require('node-cron'); 

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

    const scheduledJobData = {
        scheduled_expression: scheduled_expression,
        is_active: is_active,
        send_email: send_email
    };

    await scheduled_job.set(scheduledJobData);
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

    console.log('activeScheduledJobs', JSON.stringify(activeScheduledJobs, null, 2));


    const activeJobs = activeScheduledJobs.map((j) => ({
        user_id: j.user_id,
        org_id: j.org_id,
        management_id: j.management_id,
        scheduled_expression: j.ScheduledJob.scheduled_expression,
        send_mail: j.ScheduledJob.send_email,
    }));

    console.log('activejobs', activeJobs);


    return activeJobs;
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
