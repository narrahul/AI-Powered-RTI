const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Log API key status (safely)
console.log('AI Service: Gemini API Key is', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

// Initialize Gemini with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1beta'
});
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Generate RTI content based on user input
const generateRTIContent = async (subject, details, language = 'English') => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `Write a formal Right to Information (RTI) application in ${language} language, based on the following details:

${details}

The application should be formal, professional, clear, and specific. It should include a date, address of the applicant and authority, and clearly state the information requested under the RTI Act, 2005. Do not include any markdown formatting like bolding (**), italics (*), or headings (#). Ensure the response is plain text and ready to print and file.

Please format the response as a complete RTI application in plain text, suitable for direct submission.`;

    console.log('Sending request to Gemini API with prompt:', prompt);
    const result = await model.generateContent(prompt);
    console.log('Raw API response:', result);
    
    const generatedText = result.response.text();
    console.log('Generated text:', generatedText);
    return generatedText;
  } catch (error) {
    console.error('Detailed error in generateRTIContent:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Failed to generate RTI content: ${error.message}`);
  }
};

// Suggest relevant department and PIO
const suggestDepartmentAndPIO = async (subject, details) => {
  try {
    const prompt = `Based on the following RTI request, suggest the most appropriate government department and Public Information Officer (PIO):

Subject: ${subject}
Details: ${details}

Please provide:
1. The most relevant government department
2. The likely designation of the PIO
3. A brief explanation of why this department is appropriate

Format the response as JSON with keys: department, pioDesignation, explanation`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = JSON.parse(response.text());
    return suggestion;
  } catch (error) {
    console.error('Error suggesting department and PIO:', error);
    throw new Error('Failed to suggest department and PIO');
  }
};

// Review and improve existing RTI content
const reviewAndImproveRTI = async (content, language = 'English') => {
  try {
    const prompt = `Review and improve the following RTI application in ${language}:

${content}

Please:
1. Check for clarity and specificity
2. Ensure all necessary RTI Act references are included
3. Improve the language and structure
4. Add any missing formal elements
5. Keep the same information but make it more effective

Provide the improved version.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error reviewing RTI content:', error);
    throw new Error('Failed to review RTI content');
  }
};

module.exports = {
  generateRTIContent,
  suggestDepartmentAndPIO,
  reviewAndImproveRTI
}; 