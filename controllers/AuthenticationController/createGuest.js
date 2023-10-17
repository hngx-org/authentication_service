const User = require('../../models/Users');
const jwt = require('jsonwebtoken');

const createGuest = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  try {
    const newGuest = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: '',
      token: '',
      refresh_token: '',
      role_id: 1,
      is_verified: true,
    });

    const jwt_payload = {
      id: newGuest.id,
      firstName: newGuest.first_name,
      lastName: newGuest.last_name,
      email: newGuest.email,
    };

    const token = jwt.sign(jwt_payload, process.env.JWT_SECRET);

    return res.status(201).json({
      status: 201,
      message: 'Guest created',
      data: {
        token,
        user: {
          id: newGuest.id,
          firstName: newGuest.first_name,
          lastName: newGuest.last_name,
          email: newGuest.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error creating guest',
      error,
    });
  }
};

module.exports = createGuest;
