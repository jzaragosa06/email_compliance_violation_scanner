const { User, UserInfo, UserAuth, sequelize, Subscription, Management, LocalAuth, GoogleAuth } = require("../models");

exports.findAllUsers = async () => {
    const users = await User.findAll({
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuth,
                include: [
                    {
                        model: LocalAuth,
                    },
                    {
                        model: GoogleAuth,
                    }
                ]
            },
            {
                model: Subscription,
            }
        ]
    });

    return users;
}

exports.findUserByEmail = async (user_email) => {
    const user = await User.findOne({
        where: { user_email: user_email },
        include: [
            {
                model: UserInfo,
            },
            {
                model: UserAuth,
                include: [
                    {
                        model: LocalAuth,
                    },
                    {
                        model: GoogleAuth,
                    }
                ]
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

exports.findUserByUserId = async (user_id) => {
    const user = await User.findOne(
        {
            where: { user_id: user_id },
            include: [
                {
                    model: UserInfo,
                },
                {
                    model: UserAuth,
                    include: [
                        {
                            model: LocalAuth,
                        },
                        {
                            model: GoogleAuth,
                        }
                    ]
                },
                {
                    model: Subscription,
                },
                {
                    model: Management,
                }
            ]
        }
    );

    return user;
}

exports.createUser = async (userData, userInfoData, userAuthData, localAuthData, googleAuthData, subscriptionData) => {
    return await sequelize.transaction(async (t) => {
        const user = await User.create(userData, { transaction: t });

        const userInfo = await UserInfo.create(userInfoData, { transaction: t });

        const userAuth = await UserAuth.create(userAuthData, { transaction: t });

        const localAuth = await LocalAuth.create(localAuthData, { transaction: t });

        const googleAuth = await GoogleAuth.create(googleAuthData, { transaction: t });

        const subscription = await Subscription.create(subscriptionData, { transaction: t });



        return { user, userInfo, userAuth, localAuth, googleAuth, subscription };
    });
}

