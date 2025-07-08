const express = require("express");
const router = express.Router();
const org = require("../controller/org.controller");
const orgUserAccount = require('../controller/org-user-account-controller');
const { authenticateToken } = require("../middleware/auth.middleware");
const policy = require("../controller/policy.controller");
//org
router.get("/", authenticateToken, org.findAllOrgs);
router.post("/", authenticateToken, org.addOrg);
router.get("/:org_id", authenticateToken, org.findOrgByOrgId);
router.delete("/:org_id", authenticateToken, org.deleteOneOrgById);
router.patch("/:org_id", authenticateToken, org.updateOrgInfo);

//org user accounts
router.post("/:org_id/user-accounts", authenticateToken, org.addOrgUserAccounts);
router.delete("/:org_id/user-accounts/:org_user_account_id", authenticateToken, org.deleteOneOrgUserAccounById);

router.get('/:org_id/user-accounts', authenticateToken, org.findOrgUserAccounts);

router.patch("/user-accounts/:org_user_account_id/analysis-starting-date", authenticateToken, org.updateAnalysisStartingDate)
router.patch("/user-accounts/:org_user_account_id/update-account-status", authenticateToken, orgUserAccount.updateActiveAccountStatus)

router.post("/:org_id/user-accounts/analyze", authenticateToken, org.analyzeOrgUserAccounts);
router.get("/:org_id/user-accounts/analyze-all-authenticated-accounts", authenticateToken, org.analyzeAllAuthenticatedOrgUserAccounts) //this is triggered by button or jobs

router.get("/:org_id/user-accounts/:org_user_account_id/violations", authenticateToken, orgUserAccount.findOrgUserAccountVilolations);
router.patch("/user-accounts/violations/:email_violation_id/update-status", authenticateToken, orgUserAccount.updateViolationStatus);

router.get('/:org_id/violations/history', authenticateToken, org.findViolationHistories);

//policies
router.get('/org_id/policies', authenticateToken, policy.findPolicies);
router.post('/:org_id/policies', authenticateToken, policy.addPolicy);
router.delete('/:org_id/policies/:org_email_policy_id', authenticateToken, policy.deletePolicy);
router.patch('/:org_id/policies/:org_email_policy_id', authenticateToken, policy.updatePolicy);
module.exports = router; 
