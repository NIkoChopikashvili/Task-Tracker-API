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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.getSingleTask = exports.createTask = void 0;
const db_setup_1 = require("../config/db-setup");
const errorHandling_1 = require("../utils/errorHandling");
const taskValidation_1 = require("../validation/taskValidation");
const Task_1 = __importDefault(require("../models/Task"));
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body;
        try {
            body = yield taskValidation_1.taskCreateValidation.validateAsync(req.body);
        }
        catch (error) {
            (0, errorHandling_1.throwError)(error.message, 400);
        }
        const { title, description, status, assignedTo, deadline } = body;
        const newTask = new Task_1.default(title, description, status, assignedTo, deadline);
        yield newTask.addTask();
        const createdTask = yield (0, db_setup_1.getDb)()
            .db()
            .collection("TT_Tasks")
            .findOne({ title });
        return res
            .status(200)
            .json({ message: "successfully created new task", createdTask });
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.createTask = createTask;
const getSingleTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const [task, error] = yield Task_1.default.getSingleTask(id);
        if (error) {
            (0, errorHandling_1.throwError)(error.message, 500);
        }
        return res.status(200).json({ task });
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.getSingleTask = getSingleTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const [deletedCount, error] = yield Task_1.default.deleteTask(id);
        if (error) {
            (0, errorHandling_1.throwError)(error.message, 500);
        }
        else if (deletedCount !== 1) {
            return res
                .status(500)
                .json({ message: "Could not delete task. Try Again!." });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (err) {
        (0, errorHandling_1.catchError)(err, next);
    }
});
exports.deleteTask = deleteTask;
