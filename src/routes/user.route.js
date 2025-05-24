const express = require('express');
const router = express.Router();
const user = require("../controller/user.controller");

router.get('/', user.findAllUsers);
router.get('/:user_id/org', user.findOrgManageByUser); //fetches the org manage by th user

module.exports = router;