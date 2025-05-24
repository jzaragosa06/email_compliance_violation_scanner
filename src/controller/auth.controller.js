require("dotenv").config();

const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../services/user.service");
const { registerLocal, checkLoginCredentials } = require("../services/auth.service");

exports.registerLocal = async (req, res) => {
    const { user_email, first_name, last_name, password } = req.body;

    if (!user_email || !first_name || !last_name || !password) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    const existingUser = await findUserByEmail(user_email);
    if (existingUser) {
        return res.status(409).json({ message: "Email already in used" });
    }

    try {
        const result = await registerLocal(user_email, first_name, last_name, password); 

        return res.status(201).json({ message: "New user created.", ...result })

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

exports.loginLocal = async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json({ message: "The client sent a malformed or incomplete request" })
    }

    try {
        const user = await checkLoginCredentials(user_email, password);

        const token = jwt.sign({
            user_id: user.user_id,
            user_email: user.user_email,
            first_name: user.UserInfo.first_name,
            last_name: user.UserInfo.last_name,
        },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        return res.status(200).json({ message: "Login successfully", token: token });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

