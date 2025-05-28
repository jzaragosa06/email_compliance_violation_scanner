const { ScheduledJob, Management } = require("../models")



exports.findScheduledJobByManagementId = async (management_id) => {
    const scheduled_job = await ScheduledJob.findOne({ where: { management_id: management_id } });

    if (!scheduled_job) throw new Error("No scheduled job found");

    return scheduled_job;
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