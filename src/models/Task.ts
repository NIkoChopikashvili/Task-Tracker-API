import { TaskInterface } from "../interfaces/task/task";
import { getDb } from "../config/db-setup";

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
}
