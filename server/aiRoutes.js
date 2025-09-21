const express = require('express');
const router = express.Router();
const aiController = require('./services/aiController'); // Updated path

// Public routes for demo
router.post('/generate-rti', aiController.generateRTIContent);
router.post('/suggest', aiController.suggestDepartmentAndPIO);
router.post('/review', aiController.reviewAndImproveRTI);

module.exports = router;
