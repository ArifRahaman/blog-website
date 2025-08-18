// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('./multerconfig'); // ensure correct relative path
const { uploadAvatar, uploadCover } = require('../controllers/uploadController');

// POST /api/uploads/avatar (multipart form-data field 'avatar')
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// POST /api/uploads/cover (multipart form-data field 'cover')
router.post('/cover', upload.single('cover'), uploadCover);

module.exports = router;
