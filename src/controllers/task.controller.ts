import { getDb } from "../config/db-setup";
import { throwError, catchError } from "../utils/errorHandling";
import { ObjectId } from "mongodb";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { taskCreateValidation } from "../validation/taskValidation";
import Task from "../models/Task";

export const createTask: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let body;
    try {
      body = await taskCreateValidation.validateAsync(req.body);
    } catch (error: any) {
      throwError(error.message, 400);
    }
    const { title, description, status, assignedTo, deadline } = body;

    const newTask = new Task(title, description, status, assignedTo, deadline);
    await newTask.addTask();

    const createdTask = await getDb()
      .db()
      .collection("TT_Tasks")
      .findOne({ title });

    return res
      .status(200)
      .json({ message: "successfully created new task", createdTask });
  } catch (err) {
    catchError(err, next);
  }
};
