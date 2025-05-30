const express = require('express');
const router = express.Router();
const auth_user = require("../controller/auth-user.controller");
const auth_org_user_account = require("../controller/auth-org-user-account.controller");

// user authentication
router.post("/user/register/local", auth_user.registerLocal);
router.post("/user/login/local", auth_user.loginLocal);

router.post("/user/:type/google", auth_user.googleAuth);
router.get("/user/google/callback", auth_user.googleUserOAuthCallback);

// org user account authentication
router.get("/org-user-account/call-back", auth_org_user_account.googleOAuthCallback);


module.exports = router; 