import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Use require for pdfmake due to module compatibility issues with create-react-app
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

function App() {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantAddress: '',
    authorityName: '',
    authorityAddress: '',
    query: '',
    language: 'English',
  });
  const [rtiApplication, setRtiApplication] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { applicantName, applicantAddress, authorityName, authorityAddress, query } = formData;
    if (!applicantName || !applicantAddress || !authorityName || !authorityAddress || !query) {
      setError('Please fill out all required fields.');
      return false;
    }
    setError('');
    return true;
  };

  const generateRti = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setRtiApplication('');

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_BASE_URL}/generate-rti`, formData);
      setRtiApplication(response.data.rtiApplication);
    } catch (err) {
      setError('Failed to generate RTI application. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    const documentDefinition = {
      content: [
        { text: rtiApplication, style: 'mainContent' }
      ],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 12,
        lineHeight: 1.15
      },
      styles: {
        mainContent: {
          margin: [0, 0, 0, 0]
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download('RTI-Application.pdf');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>RTI Application Generator</h1>
        <p>Generate a formal Right to Information application, ready to print and file.</p>
      </header>
      <main>
        <div className="form-container card">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="applicantName">Your Full Name</label>
              <input type="text" id="applicantName" name="applicantName" value={formData.applicantName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="authorityName">Authority / PIO Name</label>
              <input type="text" id="authorityName" name="authorityName" value={formData.authorityName} onChange={handleInputChange} required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="applicantAddress">Your Full Address</label>
              <input type="text" id="applicantAddress" name="applicantAddress" value={formData.applicantAddress} onChange={handleInputChange} required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="authorityAddress">Full Address of Authority</label>
              <input type="text" id="authorityAddress" name="authorityAddress" value={formData.authorityAddress} onChange={handleInputChange} required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="query">Your RTI Query</label>
              <textarea id="query" name="query" value={formData.query} onChange={handleInputChange} rows="8" required />
            </div>
            <div className="form-group language-selector full-width">
              <label htmlFor="language">Output Language</label>
              <select name="language" id="language" value={formData.language} onChange={handleInputChange}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>
          </div>
          <button onClick={generateRti} disabled={loading} className="generate-btn">
            {loading ? <div className="loader" /> : 'Generate RTI Application'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        {rtiApplication && (
          <div className="rti-output card">
            <div className="output-header">
              <h2>Generated RTI Application</h2>
              <button onClick={downloadPdf} className="download-btn">Download as PDF</button>
            </div>
            <pre>{rtiApplication}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
