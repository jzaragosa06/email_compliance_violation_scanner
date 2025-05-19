const User = require("./user.model");
const UserInfo = require("./userInfo.model");
const UserAuthProvider = require("./userAuthProvider.model");
const sequelize = require("../config/db");

//constraints
User.hasOne(UserInfo, { foreignKey: 'user_id' });
UserInfo.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserAuthProvider, { foreignKey: 'user_id' });
UserAuthProvider.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, UserInfo, UserAuthProvider };