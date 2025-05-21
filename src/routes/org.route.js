const express = require("express");
const router = express.Router();
const org = require("../controller/org.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/:org_id", authenticateToken, org.getOrgByOrgId);
router.get("/", authenticateToken, org.getOrgs);
router.post("/", authenticateToken, org.addOrg);



module.exports = router; 