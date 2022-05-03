import express, { Express, Response, NextFunction, Request } from "express";
import { ErrorObject } from "./utils/errorHandling";
import { initDb } from "./config/db-setup";

import userAuthRoutes from "./routes/user/authRoutes";

import dotenv from "dotenv";

const app: Express = express();
dotenv.config();

app.use(express.json());

app.use("/user", userAuthRoutes);

app.use(
  (err: ErrorObject, req: Request, res: Response, next: NextFunction): any => {
    let { statusCode, message } = err;
    if (!message) message = "შეცდომა სერვერზე";
    if (!statusCode) statusCode = 500;
    return res.status(statusCode).json({ message });
  }
);

initDb((err: Record<string, unknown>) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mongoDb");
    app.listen(5000, async () => {
      console.log("running on port 5000");
    });
  }
});
