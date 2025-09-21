const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const RTI = require('../models/RTI');

describe('RTI Auto Generator API Tests', () => {
  let authToken;
  let testUser;
  let testRTI;

  // Setup before tests
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/rti-test');
    
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  // Cleanup after tests
  afterAll(async () => {
    await User.deleteMany({});
    await RTI.deleteMany({});
    await mongoose.connection.close();
  });

  // Test 1: Create RTI Application
  describe('Create RTI Application', () => {
    it('should create a new RTI application', async () => {
      const response = await request(app)
        .post('/api/rti')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'Test RTI Subject',
          details: 'This is a test RTI application',
          language: 'english',
          department: 'Test Department',
          pio: 'Test PIO'
        });

      expect(response.status).toBe(201);
      expect(response.body.rti).toHaveProperty('_id');
      testRTI = response.body.rti;
    });
  });

  // Test 2: Get RTI Applications
  describe('Get RTI Applications', () => {
    it('should get all RTI applications for the user', async () => {
      const response = await request(app)
        .get('/api/rti')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  // Test 3: AI Content Generation
  describe('AI Content Generation', () => {
    it('should generate RTI content using AI', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'Test RTI Subject',
          details: 'This is a test RTI application',
          language: 'english'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content');
    });

    it('should get department and PIO suggestions', async () => {
      const response = await request(app)
        .post('/api/ai/suggest')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'Test RTI Subject',
          details: 'This is a test RTI application'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('department');
      expect(response.body).toHaveProperty('pio');
    });
  });

  // Test 4: Update RTI Application
  describe('Update RTI Application', () => {
    it('should update an existing RTI application', async () => {
      const response = await request(app)
        .patch(`/api/rti/${testRTI._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'Updated Test RTI Subject',
          details: 'This is an updated test RTI application'
        });

      expect(response.status).toBe(200);
      expect(response.body.rti.subject).toBe('Updated Test RTI Subject');
    });
  });

  // Test 5: Submit RTI Application
  describe('Submit RTI Application', () => {
    it('should submit an RTI application', async () => {
      const response = await request(app)
        .post(`/api/rti/${testRTI._id}/submit`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.rti.status).toBe('submitted');
    });
  });

  // Test 6: File Appeal
  describe('File Appeal', () => {
    it('should file an appeal for a rejected RTI', async () => {
      // First, update RTI status to rejected
      await RTI.findByIdAndUpdate(testRTI._id, { status: 'rejected' });

      const response = await request(app)
        .post(`/api/rti/${testRTI._id}/appeal`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reason: 'Test appeal reason'
        });

      expect(response.status).toBe(200);
      expect(response.body.rti.status).toBe('appealed');
    });
  });

  // Test 7: Delete RTI Application
  describe('Delete RTI Application', () => {
    it('should delete an RTI application', async () => {
      const response = await request(app)
        .delete(`/api/rti/${testRTI._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });
}); 