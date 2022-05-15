import express, { Express, Response, NextFunction, Request } from "express";
import { catchError, ErrorObject, throwError } from "./utils/errorHandling";
import { initDb } from "./config/db-setup";

import userAuthRoutes from "./routes/user/authRoutes";
import taskRoutes from "./routes/taskRoutes/taskRoutes";

import dotenv from "dotenv";

const app: Express = express();
dotenv.config();

app.use(express.json());

app.use("/user", userAuthRoutes);
app.use("/task", taskRoutes);

app.use(
  (err: ErrorObject, req: Request, res: Response, next: NextFunction): any => {
    let { statusCode, message } = err;
    if (!message) message = "Server Error";
    if (!statusCode) statusCode = 500;
    return res.status(statusCode).json({ message });
  }
);

// page not found error handling  middleware
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = {
    status: 404,
    message: "Endpoint not found",
  };
  next(error);
});

// global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Server Error";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

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
