"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwt = (user, secret) => {
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        phoneVerify: user === null || user === void 0 ? void 0 : user.phoneVerify,
        emailVerify: user === null || user === void 0 ? void 0 : user.emailVerify,
    }, secret, {
    // expiresIn: "3d",
    });
    return token;
};
exports.generateJwt = generateJwt;
