"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignUpValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSignUpValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(30).required(),
    phone: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
});
