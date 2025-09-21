const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createRTI,
  getUserRTIs,
  getRTI,
  updateRTI,
  submitRTI,
  fileAppeal,
  deleteRTI
} = require('../controllers/rtiController');

// All routes require authentication
router.use(auth);

// Create new RTI application
router.post('/', createRTI);

// Get all RTI applications for the authenticated user
router.get('/', getUserRTIs);

// Get single RTI application
router.get('/:id', getRTI);

// Update RTI application
router.patch('/:id', updateRTI);

// Submit RTI application
router.post('/:id/submit', submitRTI);

// File appeal for RTI
router.post('/:id/appeal', fileAppeal);

// Delete RTI application
router.delete('/:id', deleteRTI);

module.exports = router; 