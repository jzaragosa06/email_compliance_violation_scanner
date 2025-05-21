const express = require("express");
const router = express.Router();

const user = require("./user.route");
const auth = require("./auth.route");
const org = require("./org.route"); 

router.use('/users', user);
router.use('/auth', auth);
router.use('/orgs', org); 

module.exports = router; 