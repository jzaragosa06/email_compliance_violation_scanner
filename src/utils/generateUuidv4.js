const { v4: uuidv4 } = require("uuid");

exports.generateUUIV4 = () => {
    return uuidv4();
}