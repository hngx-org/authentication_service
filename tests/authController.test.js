const request = require('supertest');
const app = require('../app');
const { transporter } = require('./setup');
const User = require('../models/User');
const mailConfig = require('../middleware/mailConfig');

// Mock User.create and User.findOne
User.create.mockResolvedValue({});
User.findOne.mockResolvedValue({});

describe('authController', () => {
  describe('sendVerificationCode', () => {
    it('should send a verification code via email', async () => {
      const response = await request(app).post('/send-verification-code').send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(mailConfig.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'john@example.com',
        }),
      );
    });

    it('should handle errors', async () => {
      // Mock User.create to throw an error
      User.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/send-verification-code').send({
        // Provide valid request data here
      });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error sending verification code.');
    });
  });

  describe('confirmVerificationCode', () => {
    it('should confirm the verification code', async () => {
      // Mock User.findOne to return a user with a valid token
      User.findOne.mockResolvedValue({ token: '123456' });

      const response = await request(app)
        .post('/confirm-verification-code')
        .send({
          email: 'john@example.com',
          verificationCode: '123456',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token verified');
    });

    it('should handle invalid email or verification code', async () => {
      // Mock User.findOne to return a user with an invalid token
      User.findOne.mockResolvedValue({ token: '654321' });

      const response = await request(app)
        .post('/confirm-verification-code')
        .send({
          email: 'john@example.com',
          verificationCode: '123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or verification code.');
    });

    it('should handle errors', async () => {
      // Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/confirm-verification-code')
        .send({
          // Provide valid request data here
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error verifying token.');
    });
  });
});
