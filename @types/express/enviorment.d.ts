import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      email: string;
      user: {
        phoneVerify?: boolean;
        emailVerify?: boolean;
      };
      name: string;
    }
  }
}
declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
    email: string;
  }
}

export {};
