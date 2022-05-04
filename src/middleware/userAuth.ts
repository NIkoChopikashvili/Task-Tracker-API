import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { catchError, throwError } from "../utils/errorHandling";

export const isAuth: RequestHandler = (req, res, next) => {
  try {
    const jwtSecret: any = process.env.JWT_SECRET_KEY;
    let decodedToken;
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throwError("you need to be logged in", 400);
    } else {
      const token = authHeader.split(" ")[1];
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (error) {
        throwError("you need to be logged in", 400);
      }
      if (!decodedToken) {
        throwError("you need to be logged in", 400);
      } else {
        if (typeof decodedToken !== "string") {
          req.userId = decodedToken.userId;
          req.email = decodedToken.email;
        }
        next();
      }
    }
  } catch (error) {
    catchError(error, next);
  }
};
