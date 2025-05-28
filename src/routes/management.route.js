const express = require("express");
const router = express.Router();
const management = require("../controller/management.controller");

router.get("/:management_id/scheduled-job", management.findScheduledJobByManagementId);
router.patch("/:management_id/scheduled-job", management.updateScheduledJob);

module.exports = router; 