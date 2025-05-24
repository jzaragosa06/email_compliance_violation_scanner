const User = require("./users.model");
const UserInfo = require("./user_infos.model");
const UserAuth = require("./user_auth.model");
const Subscription = require("./subscriptions.model");
const sequelize = require("../config/db");

const Org = require("./orgs.model");
const Policy = require("./org_email_policies.model");
const OrgUserAccount = require("./org_user_accounts.model");
const OrgInfo = require("./org_infos.model");
const Management = require("./managements.model");
const LocalAuth = require("./local_auth.model");
const GoogleAuth = require("./google_auth.model");

//constraints
User.hasOne(UserInfo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserInfo.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(UserAuth, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserAuth.belongsTo(User, { foreignKey: 'user_id' });

UserAuth.hasOne(LocalAuth, { foreignKey: 'auth_id' });
LocalAuth.belongsTo(UserAuth, { foreignKey: 'auth_id' });

UserAuth.hasOne(GoogleAuth, { foreignKey: 'auth_id' });
GoogleAuth.belongsTo(UserAuth, { foreignKey: 'auth_id' }); 

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

Org.hasMany(OrgUserAccount, { foreignKey: 'org_id', onDelete: 'CASCADE' });
OrgUserAccount.belongsTo(Org, { foreignKey: "org_id" }); 



module.exports = {
    sequelize,
    User,
    UserInfo,
    UserAuth,
    Org, Policy,
    OrgUserAccount,
    OrgInfo,
    Management,
    Subscription,
    LocalAuth,
    GoogleAuth,
};

