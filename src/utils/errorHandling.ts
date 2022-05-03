import { NextFunction } from "express";
export interface ErrorObject {
  message?: string;
  statusCode?: number;
}

export const throwError = (message: string, statusCode: number): never => {
  const error: ErrorObject = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const catchError = (error: any, next: any): NextFunction => {
  if (!error.message) error.message = "სერვერის შეცდომა";
  return next(error);
};
