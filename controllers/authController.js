const User = require('../models/User');

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      // 404 Error or custom error handling
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.verificationStatus = 'verified';
    user.verificationToken = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    // Internal error or custom error handling
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

module.exports = { verifyEmail };
