const express = require('express');
const router = express.Router();
const auth = require("../controller/auth.controller");

router.post("/register/local", auth.registerLocal);
router.post("/login/local", auth.loginLocal);

module.exports = router; 