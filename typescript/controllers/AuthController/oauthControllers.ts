import jwt from "jsonwebtoken";
import {Response} from "express"
import {GenericRequest, IUser} from "../../@types";

export const handleAuth = async (req: GenericRequest<IUser>, res: Response) => {
  const {user} = req;
  const payload = {
    id: user,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });
  return res.json({
    status: 200,
    message: 'Login successful',
    data: {
      token: accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        twoFactorAuth: user.twoFactorAuth,
      },
    },
  });
};
