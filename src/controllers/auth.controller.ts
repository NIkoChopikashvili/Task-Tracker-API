import User from "../models/user";
import { throwError, catchError } from "../utils/errorHandling";
import { hashPassword, comparePassword } from "../utils/hashing/hashPassword";
import { getDb } from "../config/db-setup";
import { userSignUpValidation } from "../validation/userValidation";
import { ObjectId } from "mongodb";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { generateJwt } from "../utils/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtRefreshSecret: any = process.env.JWT_SECRET_KEY_REFRESH;
const jwtSecret: any = process.env.JWT_SECRET_KEY;

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
    const { name, email, password, phone, team } = body;

    const userEmail = await User.checkEmailExists(email);

    if (userEmail) {
      throwError("User With That Email Already Exists", 400);
    }

    const hashedPwd = await hashPassword(password);
    const newUser = new User(email, name, hashedPwd, phone, team);
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

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const token: string = req.body.token;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, jwtRefreshSecret) as JwtPayload;
    } catch (error) {
      throwError("wrong token", 400);
    }
    if (!decodedToken || typeof decodedToken == "string") {
      return res.status(401).json({ message: "You need to login first." });
    }
    const userExists = await getDb()
      .db()
      .collection("TT_Users")
      .findOne({ _id: new ObjectId(decodedToken.userId) });

    const accessToken = generateJwt(userExists, jwtSecret);
    return res.status(200).json({ token: accessToken });
  } catch (err) {
    catchError(err, next);
  }
};

export const verifyEmail: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, emailCode } = req.body;

    const [userCode, error] = await User.findEmailCode(email, emailCode);
    if (error) {
      throwError("Could not verify email", 400);
    }
    if (!userCode) {
      throwError("Code that you entered is incorrect", 400);
    }
    if (userCode) {
      const [, error] = await User.verifyEmail(email);
      if (error) {
        throwError("Could not verify email", 400);
      }
    }
    return res.status(200).json({ message: "Email Verified", status: 200 });
  } catch (err) {
    catchError(err, next);
  }
};
