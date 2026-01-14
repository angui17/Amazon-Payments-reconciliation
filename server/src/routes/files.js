const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: process.env.UPLOAD_TEMP_DIR || './uploads' });

// upload CSV and enqueue job
router.post('/upload', upload.single('file'), (req, res) => {
  // placeholder: enqueue worker job to process CSV
  res.json({ ok: true, filename: req.file?.filename || null, message: 'File received (stub)' });
});

router.get('/:id/status', (req, res) => {
  res.json({ id: req.params.id, status: 'pending' });
});

module.exports = router;
