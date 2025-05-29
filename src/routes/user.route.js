const express = require('express');
const router = express.Router();
const user = require("../controller/user.controller");
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, user.findAllUsers);
router.get('/me/orgs', authenticateToken, authenticateToken, user.findOrgsManageByUser); //fetches the orgs manage by th user
router.delete('/me', authenticateToken, user.deleteOneUserByID);

router.patch("/me", authenticateToken, user.updateUserInfo); 

module.exports = router;