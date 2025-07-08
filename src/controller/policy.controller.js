const { findPolicy, findAllPolicies, addPolicy, deletePolicy, updatePolicy } = require("../services/policy.service");

exports.findPolicies = async (req, res) => {
    const { org_id } = req.params;
    const { query } = req.query;

    if (!org_id) return res.status(400).json({ message: "Data is malformed for incomplete" });

    try {
        if (query) {
            const policies = await findPolicy(org_id, query);
            res.status(200).json({ message: "Retrieved successfully", policies })
        } else {
            const policies = await findAllPolicies(org_id);
            res.status(200).json({ message: "Retrieved successfully", policies })
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieved policies", error: error.message });
    }
}

exports.addPolicy = async (req, res) => {
    const { org_id } = req.params;
    const { pattern } = req.body;

    if (!org_id || pattern) return res.status(400).json({ message: "Data is malformed for incomplete" });

    try {
        const policy = await addPolicy(org_id, pattern);
        return res.status(201).json({ message: "New policy created", policy });
    } catch (error) {
        return res.status(500).json({ message: "Failed to add policy", error: error.message });
    }
}

exports.deletePolicy = async (req, res) => {
    const { org_id, org_email_policy_id } = req.params;

    if (!org_id || org_email_policy_id) return res.status(400).json({ message: "Data is malformed for incomplete" });

    try {
        const policy = await deletePolicy(org_email_policy_id);
        return res.status(200).json({ message: "Deleted successfully", policy });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete policies", error: error.message });
    }
}

exports.updatePolicy = async (req, res) => {
    const { org_id, org_email_policy_id } = req.params;
    const { pattern } = req.body;
    if (!org_id || org_email_policy_id) return res.status(400).json({ message: "Data is malformed for incomplete" });

    try {
        const policy = await updatePolicy(org_email_policy_id, pattern);
        return res.status(200).json({ message: "Policy updated successfully", policy });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update policies", error: error.message });
    }
}