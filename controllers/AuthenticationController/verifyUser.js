const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const {sendWelcomeMail} = require("../MessagingController/sendWelcomeMail");

const verifyUser = async (req, res) => {
  const { token } = req.params;
  const { JWT_SECRET } = process.env;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
    req.user = decoded;
  });

  // vefiry user in database
  const user = await User.findOne({ where: { email: req.user.email } });

  if (!user) {
    return res.status(401).json({ status: 401, message: 'Invalid token' });
  }

  // update user to verified
  user.is_verified = true;
  user.save();
  const jwt_payload = {
    id: user.id,
    firstName: user.first_name,
    email: user.email,
  };

  const newtoken = jwt.sign(jwt_payload, process.env.JWT_SECRET);
  res.header('Authorization', `Bearer ${newtoken}`);


  // new response to sign user in immediately after verification
  const fullName = `${user.first_name} ${user.last_name}`;
  // Todo: add await if needed later
  sendWelcomeMail(fullName, user.email)
   return res.status(200).json({
    status: 200,
    message: 'verification successful user logged in',
    data: {
      newtoken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    },
  });
  // return res.status(200).json({
  //   status: 200,
  //   message: "User verified",
  //   data: {
  //     user: {
  //       id: user.id,
  //       firsName: user.first_name,
  //       email: user.email,
  //     },
  //   },
  // });
};

module.exports = verifyUser;
