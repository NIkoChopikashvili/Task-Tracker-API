import { any } from "joi";
import jwt from "jsonwebtoken";
import { UserProfile } from "../interfaces/user/user";

export const generateJwt: (user: UserProfile, secret: string) => string = (
  user,
  secret
) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      phone: user?.phone,
      phoneVerify: user?.phoneVerify,
      emailVerify: user?.emailVerify,
    },
    secret,
    {
      // expiresIn: "3d",
    }
  );
  return token;
};
