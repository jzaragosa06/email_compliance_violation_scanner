const { findScheduledJobByManagementId, updatedScheduledJob } = require("../services/management.service");

exports.findScheduledJobByManagementId = async (req, res) => {
    const { management_id } = req.params;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const scheduled_job = await findScheduledJobByManagementId(management_id)
        return res.status(200).json({ message: "Scheduled job found", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.updateScheduledJob = async (req, res) => {
    const { management_id } = req.params;
    const { scheduled_expression, is_active, send_email } = req.body;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const scheduled_job = await updatedScheduledJob(management_id, scheduled_expression, is_active, send_email);
        res.status(200).json({ message: "Scheduled job updated successfull", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}