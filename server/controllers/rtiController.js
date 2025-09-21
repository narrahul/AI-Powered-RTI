const RTIApplication = require('../models/RTIApplication');

// Create new RTI application
const createRTI = async (req, res) => {
  try {
    const rtiData = {
      ...req.body,
      applicant: {
        ...req.body.applicant,
        email: req.user.email // Use authenticated user's email
      }
    };

    const rti = new RTIApplication(rtiData);
    await rti.save();

    // Add RTI to user's applications
    req.user.rtiApplications.push(rti._id);
    await req.user.save();

    res.status(201).json({
      message: 'RTI application created successfully',
      rti
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating RTI application', error: error.message });
  }
};

// Get all RTI applications for a user
const getUserRTIs = async (req, res) => {
  try {
    const rtis = await RTIApplication.find({ 'applicant.email': req.user.email })
      .sort({ createdAt: -1 });
    
    res.json(rtis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RTI applications', error: error.message });
  }
};

// Get single RTI application
const getRTI = async (req, res) => {
  try {
    const rti = await RTIApplication.findOne({
      _id: req.params.id,
      'applicant.email': req.user.email
    });

    if (!rti) {
      return res.status(404).json({ message: 'RTI application not found' });
    }

    res.json(rti);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RTI application', error: error.message });
  }
};

// Update RTI application
const updateRTI = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['subject', 'content', 'department', 'pio', 'language'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const rti = await RTIApplication.findOne({
      _id: req.params.id,
      'applicant.email': req.user.email,
      status: 'draft' // Only allow updates to draft applications
    });

    if (!rti) {
      return res.status(404).json({ message: 'RTI application not found or cannot be updated' });
    }

    updates.forEach(update => rti[update] = req.body[update]);
    await rti.save();

    res.json({
      message: 'RTI application updated successfully',
      rti
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating RTI application', error: error.message });
  }
};

// Submit RTI application
const submitRTI = async (req, res) => {
  try {
    const rti = await RTIApplication.findOne({
      _id: req.params.id,
      'applicant.email': req.user.email,
      status: 'draft'
    });

    if (!rti) {
      return res.status(404).json({ message: 'RTI application not found or cannot be submitted' });
    }

    rti.status = 'submitted';
    rti.submissionDate = new Date();
    await rti.save();

    res.json({
      message: 'RTI application submitted successfully',
      rti
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting RTI application', error: error.message });
  }
};

// File appeal for RTI
const fileAppeal = async (req, res) => {
  try {
    const { reason } = req.body;
    const rti = await RTIApplication.findOne({
      _id: req.params.id,
      'applicant.email': req.user.email,
      status: { $in: ['rejected', 'responded'] }
    });

    if (!rti) {
      return res.status(404).json({ message: 'RTI application not found or cannot be appealed' });
    }

    rti.status = 'appealed';
    rti.appealDetails = {
      status: 'pending',
      reason,
      submissionDate: new Date()
    };
    await rti.save();

    res.json({
      message: 'Appeal filed successfully',
      rti
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filing appeal', error: error.message });
  }
};

// Delete RTI application (only if draft)
const deleteRTI = async (req, res) => {
  try {
    const rti = await RTIApplication.findOneAndDelete({
      _id: req.params.id,
      'applicant.email': req.user.email,
      status: 'draft'
    });

    if (!rti) {
      return res.status(404).json({ message: 'RTI application not found or cannot be deleted' });
    }

    // Remove RTI from user's applications
    req.user.rtiApplications = req.user.rtiApplications.filter(
      id => id.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ message: 'RTI application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting RTI application', error: error.message });
  }
};

module.exports = {
  createRTI,
  getUserRTIs,
  getRTI,
  updateRTI,
  submitRTI,
  fileAppeal,
  deleteRTI
}; 