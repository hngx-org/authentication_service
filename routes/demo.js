// routes/sample.js

const express = require('express');
const router = express.Router();


router.get('/sample', (req, res) => {
  res.json({ message: 'This is a sample response' });
});

router.get('/user', verifyJwt, checkRole([2]), (req, res) => {
  res.json({
    "status": 200,
    "success": true,
    message: 'This is a user sample response' });
});

router.get('/admin', verifyJwt, checkRole([3]), (req, res) => {
  res.json({
    "status": 200,
    "success": true,
    message: 'This is an admin sample response' });
});
router.get('/adminuser', verifyJwt, checkRole([2,3]), (req, res) => {
  res.json({
    "status": 200,
    "success": true,
    message: 'This is an adminuser sample response' });
});

module.exports = router;
