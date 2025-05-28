const express = require("express");
const router = express.Router();
const org = require("../controller/org.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/", authenticateToken, org.findAllOrgs);
router.post("/", authenticateToken, org.addOrg);
router.get("/:org_id", authenticateToken, org.findOrgByOrgId);
router.delete("/:org_id", authenticateToken, org.deleteOneOrgById); 


//org user accounts
router.post("/:org_id/user-accounts", authenticateToken, org.addOrgUserAccounts); 
router.delete("/:org_id/user-accounts/:org_user_account_id", authenticateToken, org.deleteOneOrgUserAccounById)
router.post("/:org_id/user-accounts/analyze", authenticateToken, org.analyzeOrgUserAccounts);
router.post("/:org_id/user-accounts/analyze-all-authenticated-accounts", authenticateToken, org.analyzeAllAuthenticatedOrgUserAccounts) //this is triggered by button or jobs

module.exports = router; 