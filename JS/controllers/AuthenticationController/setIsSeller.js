const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const Joi = require('joi');

const isSellerSchema = Joi.object({
  token: Joi.string().required(),
});

const setIsSeller = async (req, res) => {
  const { error } = isSellerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { token } = req.body;
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'user not found' });
    }
    user.update({ is_seller: true });
    return res.status(200).json({ status: 200, message: 'User set as seller' });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: 'invalid token',
    });
  }
};

module.exports = setIsSeller;
