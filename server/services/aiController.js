const aiService = require('./aiService'); // Updated path

// Generate RTI content
const generateRTIContent = async (req, res) => {
  try {
    const {
      applicantName,
      applicantAddress,
      authorityName,
      authorityAddress,
      query,
      language
    } = req.body;

    const subject = `RTI Application by ${applicantName} regarding ${query.substring(0, 50)}...`;
    const details = `
Applicant Name: ${applicantName}
Applicant Address: ${applicantAddress}
Authority/PIO Name: ${authorityName}
Authority Address: ${authorityAddress}
RTI Query: ${query}
`;

    console.log('Received request:', { subject, details, language });
    
    const content = await aiService.generateRTIContent(subject, details, language);
    console.log('Generated content:', content);
    
    res.json({ rtiApplication: content });
  } catch (error) {
    console.error('Error generating RTI content:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Failed to generate RTI content' });
  }
};

// These are no longer used but kept for completeness if needed in the future
const suggestDepartmentAndPIO = async (req, res) => {
  res.status(501).json({ message: 'Not implemented in AI-only mode' });
};

const reviewAndImproveRTI = async (req, res) => {
  res.status(501).json({ message: 'Not implemented in AI-only mode' });
};

module.exports = {
  generateRTIContent,
  suggestDepartmentAndPIO,
  reviewAndImproveRTI
};
