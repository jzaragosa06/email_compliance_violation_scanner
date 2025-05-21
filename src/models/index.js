const User = require("./users.model");
const UserInfo = require("./user_infos.model");
const UserAuthProvider = require("./user_auth_providers.model");
const Subscription = require("./subscriptions.model");
const sequelize = require("../config/db");
const Org = require("./orgs.model");
const Policy = require("./org_email_policies.model");
const OrgUserEmail = require("./org_user_emails.model");
const OrgInfo = require("./org_infos.model");
const Management = require("./managements.model");

//constraints
User.hasOne(UserInfo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserInfo.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(UserAuthProvider, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserAuthProvider.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Subscription, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

//management
User.hasOne(Management, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Management.belongsTo(User, { foreignKey: 'user_id' });

Org.hasOne(Management, { foreignKey: 'org_id', onDelete: 'CASCADE' });
Management.belongsTo(Org, { foreignKey: 'org_id' });

//org
Org.hasOne(OrgInfo, { foreignKey: 'org_id', onDelete: 'CASCADE' });
OrgInfo.belongsTo(Org, { foreignKey: 'org_id' });

Org.hasMany(Policy, { foreignKey: 'org_id', onDelete: 'CASCADE' });
Policy.belongsTo(Org, { foreignKey: 'org_id' });

Org.hasMany(OrgUserEmail, { foreignKey: 'org_id', onDelete: 'CASCADE' });
OrgUserEmail.belongsTo(Org, { foreignKey: "org_id" }); 



module.exports = { sequelize, User, UserInfo, UserAuthProvider };

