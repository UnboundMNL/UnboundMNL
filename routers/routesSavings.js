const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

const savingsController = require('../controllers/savingsController');

router.get("/savings", savingsController.savings);
router.post("/newSaving",savingsController.newSaving)

module.exports = router;  

