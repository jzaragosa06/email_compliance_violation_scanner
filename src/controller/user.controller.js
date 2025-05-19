const { User, UserInfo, UserAuthProvider } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");

exports.getUsers = async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuthProvider,
            }
        ]
    });
    return res.status(200).json({ message: "retrieved", users })
}

exports.getUser = async (user_email) => {
    const user = await User.findOne({
        where: { user_email: user_email },
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuthProvider,
            }
        ]
    });

    return user;
}

exports.createUser = async (userData, userInfoData, auth_providerData) => {
    const user = await User.create(userData);

    const userInfo = await UserInfo.create(userInfoData);

    const auth_provider = await UserAuthProvider.create(auth_providerData);

    return { user, userInfo, auth_provider };
}