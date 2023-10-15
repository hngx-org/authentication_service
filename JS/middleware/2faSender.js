/*eslint-disable*/
const send2fa = require('../helpers/send2fa');

const twoStepSender = async (req, res, next) => {
  const { user } = req;
  if (!user.two_factor_auth) {
    return next();
  }
  const response = await send2fa(user);
  res.status(response.status).json({ response });
};

module.exports = twoStepSender;
