const express = require("express");
const router = express.Router();
const org = require("../controller/org.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/:org_id", authenticateToken, org.findOrgByOrgId);
router.get("/", authenticateToken, org.findAllOrgs);
router.post("/", authenticateToken, org.addOrg);

module.exports = router; 