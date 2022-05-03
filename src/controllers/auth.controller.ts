import User from "../models/User";
import { throwError, catchError } from "../utils/errorHandling";

import { hashPassword } from "../utils/hashing/hashPassword";
import { getDb } from "../config/db-setup";
import { userSignUpValidation } from "../validation/userValidation";

import { ObjectId } from "mongodb";
import { RequestHandler, Request, Response, NextFunction } from "express";

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
