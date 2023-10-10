const { expect } = require('chai');
const { validationResult } = require('express-validator');
const sinon = require('sinon');
const regMiddleware  = require('../middleware/registrationValidation'); // Adjust the path as needed
const User = require('../models/Users'); // Adjust the path as needed

describe('Registration Middleware', () => {
  // Define a mock request, response, and next function for each test case
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: sinon.stub().returns({
        json: sinon.stub(),
      }),
    };
    next = sinon.stub();
  });

  it('should pass validation for a valid registration request', async () => {
    // Set valid request body
    req.body = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Secure123!',
      passwordConfirmation: 'Secure123!',
    };

    await regMiddleware(req, res, next);

    // Check that next() was called
    expect(next.calledOnce).to.be.true;
  });

  it('should return validation errors for an invalid registration request', async () => {
    // Set invalid request body
    req.body = {
      username: '', // Missing username
      email: 'invalid-email', // Invalid email format
      password: 'short', // Password too short
      passwordConfirmation: 'password', // Password confirmation mismatch
    };

    await regMiddleware(req, res, next);

    // Check that res.status and res.json were called with validation errors
    expect(res.status.calledWith(422)).to.be.true;
    expect(res.status().json.calledOnce).to.be.true;

    // Check that validationResult contains validation errors
    const errors = res.status().json.firstCall.args[0].errors;
    expect(errors).to.be.an('array');
    expect(errors).to.have.lengthOf.at.least(1);
  });

  it('should return an error if email is already in use', async () => {
    // Set valid request body with an email that already exists
    req.body = {
      username: 'newuser',
      email: 'existing@example.com', // Email that already exists in the database
      password: 'Secure123!',
      passwordConfirmation: 'Secure123!',
    };

    // Stub the findOne method of the User model to simulate an existing user
    sinon.stub(User, 'findOne').resolves({});

    await regMiddleware(req, res, next);

    // Check that res.status and res.json were called with an email in use error
    expect(res.status.calledWith(422)).to.be.true;
    expect(res.status().json.calledOnce).to.be.true;

    // Check that validationResult contains the email in use error
    const errors = res.status().json.firstCall.args[0].errors;
    expect(errors).to.be.an('array');
    expect(errors).to.have.lengthOf.at.least(1);
    expect(errors[0].msg).to.equal('E-mail already in use');

    // Restore the stubbed User.findOne method
    User.findOne.restore();
  });

  it('should return an error if username is already in use', async () => {
    // Set valid request body with a username that already exists
    req.body = {
      username: 'existinguser', // Username that already exists in the database
      email: 'new@example.com',
      password: 'Secure123!',
      passwordConfirmation: 'Secure123!',
    };

    // Stub the findOne method of the User model to simulate an existing user
    sinon.stub(User, 'findOne').resolves({});

    await regMiddleware(req, res, next);

    // Check that res.status and res.json were called with a username in use error
    expect(res.status.calledWith(422)).to.be.true;
    expect(res.status().json.calledOnce).to.be.true;

    // Check that validationResult contains the username in use error
    const errors = res.status().json.firstCall.args[0].errors;
    expect(errors).to.be.an('array');
    expect(errors).to.have.lengthOf.at.least(1);
    expect(errors[0].msg).to.equal('Username already in use');

    // Restore the stubbed User.findOne method
    User.findOne.restore();
  });
});
