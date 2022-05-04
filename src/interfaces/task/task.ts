export interface TaskInterface {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string[];
  deadline?: Date;
}
