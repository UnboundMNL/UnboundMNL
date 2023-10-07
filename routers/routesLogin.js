const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

const loginController = require('../controllers/loginController');

//logging in
router.post("/login", loginController.login);
  
router.post("/logout", loginController.logout);

router.post("/sidebarChange", loginController.sidebarChange);
// Server-side route to clear the session
router.post("/clear-session", loginController.clearSession);


module.exports = router;  