const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { height, shoulderWidth, hip, waist, inseam, userId } = req.body;

  // You can save to a database here if needed

  console.log('Received measurements:', req.body);
  res.status(200).json({ message: 'Measurements saved successfully' });
});

// routes/measurements.js
router.post('/', (req, res) => {
  const data = req.body;
  console.log("Received measurements:", data);
  res.status(200).json({ message: "Measurements saved" });
});

module.exports = router;
