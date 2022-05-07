"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_setup_1 = require("../config/db-setup");
const mongodb_1 = require("mongodb");
const errorHandling_1 = require("../utils/errorHandling");
class Task {
    constructor(title, description, status, assignedTo, deadline) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.assignedTo = assignedTo;
        this.deadline = deadline;
    }
    addTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_setup_1.getDb)().db().collection("TT_Tasks").insertOne({
                title: this.title,
                description: this.description,
                status: this.status,
                assignedTo: this.assignedTo,
                deadline: this.deadline,
                createdAt: new Date(),
            });
        });
    }
    static getSingleTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield (0, db_setup_1.getDb)()
                    .db()
                    .collection("TT_Tasks")
                    .findOne({ _id: new mongodb_1.ObjectId(taskId) });
                if (!task) {
                    (0, errorHandling_1.throwError)("No Task Found", 500);
                }
                return [task, null];
            }
            catch (err) {
                return [null, err];
            }
        });
    }
}
exports.default = Task;
