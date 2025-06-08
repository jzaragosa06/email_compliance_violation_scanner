const req = require("express/lib/request");
const { findEmailViolationByOrgUserAccountId, updateViolationStatus } = require("../services/violations.service");
const { updateActiveAccountStatus } = require("../services/org_user_account.service");

exports.findOrgUserAccountVilolations = async (req, res) => {
    const { org_id, org_user_account_id } = req.params;

    try {
        const violations = await findEmailViolationByOrgUserAccountId(org_user_account_id);
        return res.status(200).json({ message: "Violations retrieved successfully", violations })
    } catch (error) {
        return res.status(500).json({ message: "Failed to retreived violations", error: error.message });
    }
}

exports.updateViolationStatus = async (req, res) => {
    const { email_violation_id } = req.params;
    const { is_confirmed_violation } = req.body;

    try {
        const emailViolation = await updateViolationStatus(email_violation_id, is_confirmed_violation);
        return res.status(200).json({ message: "Updated successfully", emailViolation });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update violation status", error: error.message })
    }
}

exports.updateActiveAccountStatus = async (req, res) => {
    const { org_user_account_id } = req.params;
    const { is_active } = req.body;

    try {
        const emailAccountStatus = await updateActiveAccountStatus(org_user_account_id, is_active);

        res.status(200).json({ message: "Successfully updated.", emailAccountStatus });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update account status", error: error.message })
    }
}