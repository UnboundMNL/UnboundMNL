const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadsController = require('../controllers/uploadsController');

const upload = multer({ dest: 'uploads/' });

router.post('/uploadUsers', upload.single('file'), uploadsController.post);

module.exports = router;