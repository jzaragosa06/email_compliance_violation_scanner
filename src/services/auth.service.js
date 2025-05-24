const { generateUUIV4 } = require("../utils/generateUuidv4");
const { createUser, findUserByEmail } = require("./user.service");
const bcryptjs = require("bcryptjs");

exports.registerLocal = async (user_email, first_name, last_name, password) => {
    const user_id = generateUUIV4();
    const auth_id = generateUUIV4();
    const subscription_id = generateUUIV4();

    const userData = {
        user_id: user_id,
        user_email: user_email
    }

    const userInfoData = {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
    }

    const userAuthData = {
        auth_id: auth_id,
        user_id: user_id,
        provider_name: 'local',
    }

    const localAuthData = {
        auth_id: auth_id,
        password_hash: await bcryptjs.hash(password, 10)
    }

    const googleAuthData = {
        auth_id: auth_id,
    }

    const subscriptionData = {
        subscription_id: subscription_id,
        user_id: user_id,
        subscription_type: 'FREE',
    }

    return await createUser(userData, userInfoData, userAuthData, localAuthData, googleAuthData, subscriptionData)
}


exports.checkLoginCredentials = async (user_email, password) => {
    const user = await findUserByEmail(user_email);
    if (user == null) {
        throw new Error('User not found');
    }

    const passwordMatch = await bcryptjs.compare(password, user.UserAuth.LocalAuth.password_hash)
    if (!passwordMatch) {
        throw new Error('Incorrect password');
    }

    return user;
}