const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// POST image + fitting info
router.post('/upload', upload.single('bodyImage'), (req, res) => {
  const fittingInfo = {
    userId: req.body.userId,
    dressImage: req.body.dressImage,
    bodyImage: `/uploads/${req.file.filename}`,
    position: JSON.parse(req.body.position),
    timestamp: new Date().toISOString()
  };

  // Save history to file (or DB)
  const historyPath = 'uploads/fitting-history.json';
  const history = fs.existsSync(historyPath)
    ? JSON.parse(fs.readFileSync(historyPath))
    : [];

  history.push(fittingInfo);
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  res.status(200).json({ message: 'Fitting saved', data: fittingInfo });
});

// ✅ Export router
module.exports = router;
