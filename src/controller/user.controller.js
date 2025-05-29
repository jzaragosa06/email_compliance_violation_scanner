const { deleteOneOrgById, findOrgsByUserID } = require("../services/org.service");
const { findAllUsers, updateUserInfo } = require("../services/user.service");

exports.findAllUsers = async (req, res) => {
    const users = await findAllUsers();
    return res.status(200).json({ message: "User retrieved successfully", users });
}


exports.findOrgsManageByUser = async (req, res) => {
    const { user_id } = req.user;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    const orgs = await findOrgsByUserID(user_id);

    if (!orgs) return res.status(404).json({ message: "No organization(s) found for user" });

    return res.status(200).json({ message: "Organization found", orgs })
}

exports.deleteOneUserByID = async (req, res) => {
    const { user_id } = req.user;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const user = await deleteOneOrgById(user_id);

        return res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        return res.status(500).json({ message: 'User failed to delete', error: error.message });

    }
}

exports.updateUserInfo = async (req, res) => {
    const { user_id } = req.user;

    const { first_name, last_name, country, contact_number, job_title } = req.body;

    try {
        const userInfo = await updateUserInfo(user_id, first_name, last_name, country, contact_number, job_title);
        return res.status(200).json({ message: 'User info successfully updated', userInfo })

    } catch (error) {
        return res.status(500).json({ message: 'User info failed to update', error: error.message })
    }
}