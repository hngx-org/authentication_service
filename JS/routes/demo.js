// routes/sample.js

const express = require('express');

const router = express.Router();

router.get('/sample', (req, res) => {
  res.json({ message: 'This is a sample response' });
});

module.exports = router;
