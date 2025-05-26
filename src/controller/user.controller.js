const { findOrgByUserID, deleteOneOrgById } = require("../services/org.service");
const { findAllUsers } = require("../services/user.service");

exports.findAllUsers = async (req, res) => {
    const users = await findAllUsers();
    return res.status(200).json({ message: "User retrieved successfully", users });
}


exports.findOrgManageByUser = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    const org = await findOrgByUserID(user_id);

    if (!org) return res.status(404).json({ message: "No organization found for user" });

    return res.status(200).json({ message: "Organization found", org })
}

exports.deleteOneUserByID = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" });

    try {
        const user = await deleteOneOrgById(user_id);

        return res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        return res.status(200).json({ message: error.message });

    }
}