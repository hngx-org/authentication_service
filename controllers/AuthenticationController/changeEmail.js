const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../../models/Users');

const { BadRequest } = require('../../errors/httpErrors');
const { INVALID_INPUT_PARAMETERS } = require('../../errors/httpErrorCodes');

const changeEmailSchema = Joi.object({
  newEmail: Joi.string().email().required(),
});

const changeEmail = async (req, res) => {
  const { error } = changeEmailSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message, INVALID_INPUT_PARAMETERS);
  }

  const { newEmail } = req.body;
  const token = req.headers.authorization;

  try {
    const newToken = token.substring(7, token.length);

    const userId = jwt.decode(newToken).id;

    // Find the user in the database
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errorCode: 'RESOURCE_NOT_FOUND',
      });
    }

    // Check if the new email is already in use
    const existingUserWithNewEmail = await User.findOne({
      where: { email: newEmail },
    });

    if (existingUserWithNewEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
        errorCode: 'EMAIL_ALREADY_IN_USE',
      });
    }

    // Perform the email change operation
    user.email = newEmail;
    await user.save();

    // Return a success response
    res.status(200).json({
      success: true,
      message: 'Email address changed successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
};

module.exports = changeEmail;
