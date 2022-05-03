import User from "../models/User";
import { throwError, catchError } from "../utils/errorHandling";
import { hashPassword, comparePassword } from "../utils/hashing/hashPassword";
import { getDb } from "../config/db-setup";
import { userSignUpValidation } from "../validation/userValidation";
import { ObjectId } from "mongodb";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { generateJwt } from "../utils/jwt";

export const userSignUp: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let body;
    try {
      body = await userSignUpValidation.validateAsync(req.body);
    } catch (error: any) {
      throwError(error.message, 400);
    }
    const { name, email, password, phone } = body;

    const userEmail = await User.checkEmailExists(email);

    if (userEmail) {
      throwError("User With That Email Already Exists", 400);
    }

    const hashedPwd = await hashPassword(password);
    const newUser = new User(email, name, hashedPwd, phone);
    await newUser.addUser();

    const userData = await getDb()
      .db()
      .collection("TT_Users")
      .findOne({ email });

    return res.status(200).json({ message: "success", userData });
  } catch (err) {
    catchError(err, next);
  }
};

export const userSignIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const userExists: any = await User.checkEmailExists(email);

    const jwtRefreshSecret: any = process.env.JWT_SECRET_KEY_REFRESH;
    const jwtSecret: any = process.env.JWT_SECRET_KEY;

    if (!userExists) {
      throwError("არასწორი მეილი ან პაროლი", 400);
    } else {
      const isCorrect = await comparePassword(password, userExists.password);
      if (!isCorrect) {
        throwError("არასწორი მეილი ან პაროლი", 400);
      }

      const refreshToken = generateJwt(userExists, jwtRefreshSecret);
      const token = generateJwt(userExists, jwtSecret);

      return res.status(200).json({ token, refreshToken });
    }
  } catch (err) {
    catchError(err, next);
  }
};
