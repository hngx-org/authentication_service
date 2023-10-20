const bcrypt = require('bcrypt');
const User = require('../../models/Users');
const slugify = require('../../helpers/slugify');

const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      username: '',
      token: '',
      refresh_token: '',
      slug: await slugify(firstName, lastName),
    });

    req.user = {
      id: newUser.id,
      slug: newUser.slug,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
    };
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error creating user',
      error,
    });
  }

  next();
};

module.exports = createUser;
