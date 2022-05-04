"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandling_1 = require("../utils/errorHandling");
const isAuth = (req, res, next) => {
    try {
        const jwtSecret = process.env.JWT_SECRET_KEY;
        let decodedToken;
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            (0, errorHandling_1.throwError)("you need to be logged in", 400);
        }
        else {
            const token = authHeader.split(" ")[1];
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
            }
            catch (error) {
                (0, errorHandling_1.throwError)("you need to be logged in", 400);
            }
            if (!decodedToken) {
                (0, errorHandling_1.throwError)("you need to be logged in", 400);
            }
            else {
                if (typeof decodedToken !== "string") {
                    req.userId = decodedToken.userId;
                    req.email = decodedToken.email;
                }
                next();
            }
        }
    }
    catch (error) {
        (0, errorHandling_1.catchError)(error, next);
    }
};
exports.isAuth = isAuth;
