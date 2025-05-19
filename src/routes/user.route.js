const express = require('express');
const router = express.Router();
const user = require("../controller/user.controller");

router.get('/', user.getUsers);

module.exports = router;