const express = require("express");
const router = express.Router();
const management = require("../controller/management.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/:management_id/scheduled-job", authenticateToken, management.findScheduledJobByManagementId);
router.patch("/:management_id/scheduled-job", authenticateToken, management.updateScheduledJob);
router.patch("/:management_id/scheduled-job/recieve-email-report", authenticateToken, management.updateRecieveEmailReport)
router.patch("/:management_id/scheduled-job/automate-analysis", authenticateToken, management.updateAutomateAnalysis)
router.patch("/:management_id/scheduled-job/schedule", authenticateToken, management.updateScheduledExpression,)
module.exports = router; 