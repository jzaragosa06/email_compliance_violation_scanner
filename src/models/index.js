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
const Admin = require("./admins.model");
const EmailAccountAuth = require("./email_account_auth.model");
const EmailAccountStatus = require("./email_account_status.model");
const EmailViolations = require("./email_violations.model");
const ViolationEvidence = require("./violation_evidences.model");
const ScheduledJob = require("./scheduled_jobs.model");
const EmailAnalysisLog = require("./email_analysis_logs.model");

//constraints
User.hasOne(UserInfo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserInfo.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(UserAuth, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserAuth.belongsTo(User, { foreignKey: 'user_id' });

UserAuth.hasOne(LocalAuth, { foreignKey: 'auth_id', onDelete: 'CASCADE' });
LocalAuth.belongsTo(UserAuth, { foreignKey: 'auth_id' });

UserAuth.hasOne(GoogleAuth, { foreignKey: 'auth_id', onDelete: 'CASCADE' });
GoogleAuth.belongsTo(UserAuth, { foreignKey: 'auth_id' }); 

User.hasOne(Subscription, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

//management
User.hasMany(Management, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Management.belongsTo(User, { foreignKey: 'user_id' });

Org.hasOne(Management, { foreignKey: 'org_id', onDelete: 'CASCADE' });
Management.belongsTo(Org, { foreignKey: 'org_id' });

Management.hasMany(EmailViolations, { foreignKey: 'management_id', onDelete: 'CASCADE' });
EmailViolations.belongsTo(Management, { foreignKey: 'management_id' });

EmailViolations.hasOne(ViolationEvidence, { foreignKey: 'email_violation_id', onDelete: 'CASCADE' });
ViolationEvidence.belongsTo(EmailViolations, { foreignKey: 'email_violation_id' });

Management.hasOne(ScheduledJob, { foreignKey: 'management_id', onDelete: 'CASCADE' });
ScheduledJob.belongsTo(Management, { foreignKey: 'management_id' }); 

//org
Org.hasOne(OrgInfo, { foreignKey: 'org_id', onDelete: 'CASCADE', });
OrgInfo.belongsTo(Org, { foreignKey: 'org_id' });

Org.hasMany(Policy, { foreignKey: 'org_id', onDelete: 'CASCADE' });
Policy.belongsTo(Org, { foreignKey: 'org_id' });

// Org User accounts
Org.hasMany(OrgUserAccount, { foreignKey: 'org_id', onDelete: 'CASCADE' });
OrgUserAccount.belongsTo(Org, { foreignKey: "org_id" }); 

OrgUserAccount.hasOne(EmailAccountAuth, { foreignKey: 'org_user_account_id', onDelete: 'CASCADE' });
EmailAccountAuth.belongsTo(OrgUserAccount, { foreignKey: 'org_user_account_id', });

OrgUserAccount.hasOne(EmailAccountStatus, { foreignKey: 'org_user_account_id', onDelete: 'CASCADE' });
EmailAccountStatus.belongsTo(OrgUserAccount, { foreignKey: 'org_user_account_id' });

OrgUserAccount.hasOne(EmailAnalysisLog, { foreignKey: 'org_user_account_id', onDelete: 'CASCADE' });
EmailAnalysisLog.belongsTo(OrgUserAccount, { foreignKey: 'org_user_account_id' });

OrgUserAccount.hasMany(EmailViolations, { foreignKey: 'org_user_account_id', onDelete: 'CASCADE' });
EmailViolations.belongsTo(OrgUserAccount, { foreignKey: 'org_user_account_id' });

module.exports = {
    sequelize,
    User,
    UserInfo,
    UserAuth,
    Org,
    Policy,
    OrgUserAccount,
    OrgInfo,
    Management,
    Subscription,
    LocalAuth,
    GoogleAuth,
    Admin,
    EmailAccountAuth,
    EmailAccountStatus,
    EmailViolations,
    ViolationEvidence,
    ScheduledJob,
    EmailAnalysisLog
};

