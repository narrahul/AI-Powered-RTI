const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Public routes for demo
router.post('/generate-rti', aiController.generateRTIContent); // Updated endpoint
router.post('/suggest', aiController.suggestDepartmentAndPIO);
router.post('/review', aiController.reviewAndImproveRTI);

module.exports = router; 