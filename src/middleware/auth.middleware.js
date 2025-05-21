const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];


    if (!token) return res.status(401).json({ message: "Unauthorized access. No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err);

        if (err) return res.status(403).json({ message: "Invalid Token" });

        req.user = user;

        next();
    });

}