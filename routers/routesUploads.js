const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadsController = require('../controllers/uploadsController');

const upload = multer({ dest: 'uploads/' });

router.post('/uploadUsers', upload.single('file'), uploadsController.post);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.body.id + '-' + Date.now() + ext);
  }
});

const uploadPicture = multer({ storage: multer.memoryStorage() });

router.post('/uploadMemberProfilePic', uploadPicture.single('profilePic'), uploadsController.uploadMemberProfilePic);
router.post('/uploadUserProfilePic', uploadPicture.single('profilePic'), uploadsController.uploadUserProfilePic);

module.exports = router;