"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.throwError = void 0;
const throwError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};
exports.throwError = throwError;
const catchError = (error, next) => {
    if (!error.message)
        error.message = "სერვერის შეცდომა";
    return next(error);
};
exports.catchError = catchError;
