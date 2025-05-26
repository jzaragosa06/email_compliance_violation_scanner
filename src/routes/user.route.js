const express = require('express');
const router = express.Router();
const user = require("../controller/user.controller");
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, user.findAllUsers);
router.get('/:user_id/org', authenticateToken, authenticateToken, user.findOrgManageByUser); //fetches the org manage by th user
router.delete('/:user_id', authenticateToken, user.deleteOneUserByID); 

module.exports = router;