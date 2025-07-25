const { reloadEmailAnalysisJobs } = require("../jobs/emailAnalysis.job");
const { findScheduledJobByManagementId, updatedScheduledJob, validateScheduledExpression, updateRecievEmailReport, updateAutomateAnalysis, updatedScheduleExpression } = require("../services/management.service");

exports.findScheduledJobByManagementId = async (req, res) => {
    const { management_id } = req.params;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const scheduled_job = await findScheduledJobByManagementId(management_id)
        return res.status(200).json({ message: "Scheduled job found", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.updateScheduledJob = async (req, res) => {
    const { management_id } = req.params;
    const { scheduled_expression, is_active, send_email } = req.body;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    //validate node-cron expression
    validateScheduledExpression(scheduled_expression); 

    try {
        const scheduled_job = await updatedScheduledJob(management_id, scheduled_expression, is_active, send_email);

        //reload the email analysis job
        await reloadEmailAnalysisJobs(); 

        res.status(200).json({ message: "Scheduled job updated successfull", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.updateRecieveEmailReport = async (req, res) => {
    const { management_id } = req.params;
    const { send_email } = req.body;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const scheduled_job = await updateRecievEmailReport(management_id, send_email);

        //reload the email analysis job
        await reloadEmailAnalysisJobs();

        res.status(200).json({ message: "Scheduled job updated successfull", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.updateAutomateAnalysis = async (req, res) => {
    const { management_id } = req.params;
    const { is_active } = req.body;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const scheduled_job = await updateAutomateAnalysis(management_id, is_active,);

        //reload the email analysis job
        await reloadEmailAnalysisJobs();

        res.status(200).json({ message: "Scheduled job updated successfull", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.updateScheduledExpression = async (req, res) => {
    const { management_id } = req.params;
    const { scheduled_expression } = req.body;

    if (!management_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    //validate node-cron expression
    validateScheduledExpression(scheduled_expression);

    try {
        const scheduled_job = await updatedScheduleExpression(management_id, scheduled_expression);

        //reload the email analysis job
        await reloadEmailAnalysisJobs();

        res.status(200).json({ message: "Scheduled job updated successfull", scheduled_job });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}