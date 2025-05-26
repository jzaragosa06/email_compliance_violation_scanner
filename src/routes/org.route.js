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

module.exports = router; 