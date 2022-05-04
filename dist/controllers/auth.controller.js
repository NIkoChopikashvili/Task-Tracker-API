"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.userSignIn = exports.userSignUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const errorHandling_1 = require("../utils/errorHandling");
const hashPassword_1 = require("../utils/hashing/hashPassword");
const db_setup_1 = require("../config/db-setup");
const userValidation_1 = require("../validation/userValidation");
const mongodb_1 = require("mongodb");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtRefreshSecret = process.env.JWT_SECRET_KEY_REFRESH;
const jwtSecret = process.env.JWT_SECRET_KEY;
const userSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body;
        try {
            body = yield userValidation_1.userSignUpValidation.validateAsync(req.body);
        }
        catch (error) {
            (0, errorHandling_1.throwError)(error.message, 400);
        }
        const { name, email, password, phone, team } = body;
        const userEmail = yield User_1.default.checkEmailExists(email);
        if (userEmail) {
            (0, errorHandling_1.throwError)("User With That Email Already Exists", 400);
        }
        const hashedPwd = yield (0, hashPassword_1.hashPassword)(password);
        const newUser = new User_1.default(email, name, hashedPwd, phone, team);
        yield newUser.addUser();
        const userData = yield (0, db_setup_1.getDb)()
            .db()
            .collection("TT_Users")
            .findOne({ email });
        return res.status(200).json({ message: "success", userData });
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.userSignUp = userSignUp;
const userSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userExists = yield User_1.default.checkEmailExists(email);
        if (!userExists) {
            (0, errorHandling_1.throwError)("არასწორი მეილი ან პაროლი", 400);
        }
        else {
            const isCorrect = yield (0, hashPassword_1.comparePassword)(password, userExists.password);
            if (!isCorrect) {
                (0, errorHandling_1.throwError)("არასწორი მეილი ან პაროლი", 400);
            }
            const refreshToken = (0, jwt_1.generateJwt)(userExists, jwtRefreshSecret);
            const token = (0, jwt_1.generateJwt)(userExists, jwtSecret);
            return res.status(200).json({ token, refreshToken });
        }
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.userSignIn = userSignIn;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        let decodedToken;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, jwtRefreshSecret);
        }
        catch (error) {
            (0, errorHandling_1.throwError)("wrong token", 400);
        }
        if (!decodedToken || typeof decodedToken == "string") {
            return res.status(401).json({ message: "You need to login first." });
        }
        const userExists = yield (0, db_setup_1.getDb)()
            .db()
            .collection("TT_Users")
            .findOne({ _id: new mongodb_1.ObjectId(decodedToken.userId) });
        const accessToken = (0, jwt_1.generateJwt)(userExists, jwtSecret);
        return res.status(200).json({ token: accessToken });
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.refreshToken = refreshToken;
