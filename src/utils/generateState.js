const crypto = require("crypto");

exports.generateState = () => {
    return crypto.randomBytes(32).toString('hex');
}