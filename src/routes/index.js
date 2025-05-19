const express = require("express");
const router = express.Router();

const user = require("./user.route");
const auth = require("./auth.route");

router.use('/users', user);
router.use('/auth', auth);

module.exports = router; 