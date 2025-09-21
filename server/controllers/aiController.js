const aiService = require('../services/aiService');

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
    
    res.json({ rtiApplication: content }); // Changed property name to rtiApplication
  } catch (error) {
    console.error('Error generating RTI content:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Failed to generate RTI content' });
  }
};

// Suggest department and PIO (leaving as is for now, not used by new client App.js)
const suggestDepartmentAndPIO = async (req, res) => {
  try {
    const { subject, details } = req.body;
    const suggestions = await aiService.suggestDepartmentAndPIO(subject, details);
    res.json(suggestions);
  } catch (error) {
    console.error('Error suggesting department and PIO:', error);
    res.status(500).json({ message: 'Failed to suggest department and PIO' });
  }
};

// Review and improve RTI content (leaving as is for now, not used by new client App.js)
const reviewAndImproveRTI = async (req, res) => {
  try {
    const { content, language } = req.body;
    const improvedContent = await aiService.reviewAndImproveRTI(content, language);
    res.json({ content: improvedContent });
  } catch (error) {
    console.error('Error reviewing RTI content:', error);
    res.status(500).json({ message: 'Failed to review RTI content' });
  }
};

module.exports = {
  generateRTIContent,
  suggestDepartmentAndPIO,
  reviewAndImproveRTI
}; 