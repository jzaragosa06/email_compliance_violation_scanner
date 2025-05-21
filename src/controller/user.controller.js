const { User, UserInfo, UserAuthProvider } = require("../models");
const sequelize = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const Subscription = require("../models/subscriptions.model");
const Management = require("../models/managements.model");
const { getOrgByUserID } = require("./org.controller");

exports.getUsers = async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuthProvider,
            },
            {
                model: Subscription,
            }
        ]
    });
    return res.status(200).json({ message: "retrieved", users })
}

exports.getUserByEmail = async (user_email) => {
    const user = await User.findOne({
        where: { user_email: user_email },
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuthProvider,
            },
            {
                model: Subscription
            },
            {
                model: Management, 
            }
        ]
    });

    return user;
}

exports.createUser = async (userData, userInfoData, auth_providerData, subscriptionData) => {
    return await sequelize.transaction(async (t) => {
        const user = await User.create(userData, { transaction: t });

        const userInfo = await UserInfo.create(userInfoData, { transaction: t });

        const auth_provider = await UserAuthProvider.create(auth_providerData, { transaction: t });

        const subscription = await Subscription.create(subscriptionData, { transaction: t });

        return { user, userInfo, auth_provider, subscription }; 
    });
}

exports.getOrgManageByUser = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    const org = await getOrgByUserID(user_id);

    if (!org) return res.status(404).json({ message: "No organization found for user" });

    return res.status(200).json({ message: "Organization found", org })
}