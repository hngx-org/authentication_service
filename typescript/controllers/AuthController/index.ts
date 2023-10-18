import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

interface CustomRequest extends ExpressRequest {
  user: User; // Assuming 'user' is attached to the request
}

const loginResponse = async (req: CustomRequest, res: Response) => {
  const user = req.user as User; // Assuming user is correctly attached to the request

  user.update({ last_login: new Date() });

  const jwtPayload = {
    id: user.id,
  };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string);

  res.header('Authorization', `Bearer ${token}`);

  return res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        roleId: user.role_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isVerified: user.is_verified,
        twoFactorAuth: user.two_factor_auth,
        isSeller: user.is_seller,
      },
    },
  });
};

export default loginResponse;
