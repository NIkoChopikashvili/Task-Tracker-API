import { TaskInterface } from "../interfaces/task/task";
import { getDb } from "../config/db-setup";
import { ObjectId } from "mongodb";
import { throwError } from "../utils/errorHandling";

export default class Task implements TaskInterface {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly status: string,
    readonly assignedTo: string[],
    readonly deadline: any
  ) {}

  async addTask(): Promise<string | unknown> {
    return await getDb().db().collection("TT_Tasks").insertOne({
      title: this.title,
      description: this.description,
      status: this.status,
      assignedTo: this.assignedTo,
      deadline: this.deadline,
      createdAt: new Date(),
    });
  }
  static async getSingleTask(
    taskId: string
  ): Promise<[null, Error] | [TaskInterface, null]> {
    try {
      const task: any = await getDb()
        .db()
        .collection("TT_Tasks")
        .findOne<TaskInterface>({ _id: new ObjectId(taskId) });
      if (!task) {
        throwError("No Task Found", 500);
      }
      return [task, null];
    } catch (err: any) {
      return [null, err];
    }
  }
  static async deleteTask(
    taskId: string
  ): Promise<[null, Error] | [number, null]> {
    try {
      const deletedTask: any = await getDb()
        .db()
        .collection("TT_Tasks")
        .deleteOne({ _id: new ObjectId(taskId) });
      return [deletedTask.deletedCount, null];
    } catch (err: any) {
      console.log(err);
      return [null, err];
    }
  }
}
