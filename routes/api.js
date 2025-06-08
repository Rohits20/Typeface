const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const {register, login} = require('../controllers/authController');

const {
  uploadFile,
  getFiles,
  downloadFile
} = require('../controllers/fileController');
const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/files/upload', auth, upload.single('file'), uploadFile);
router.get('/files', auth, getFiles);
router.get('/download/:uuid', auth, downloadFile);

module.exports = router;