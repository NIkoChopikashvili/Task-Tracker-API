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
const express_1 = __importDefault(require("express"));
const db_setup_1 = require("./config/db-setup");
const authRoutes_1 = __importDefault(require("./routes/user/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes/taskRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use("/user", authRoutes_1.default);
app.use("/task", taskRoutes_1.default);
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    if (!message)
        message = "Server Error";
    if (!statusCode)
        statusCode = 500;
    return res.status(statusCode).json({ message });
});
// page not found error handling  middleware
app.use("*", (req, res, next) => {
    const error = {
        status: 404,
        message: "Endpoint not found",
    };
    next(error);
});
// global error handling middleware
app.use((err, req, res, next) => {
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
(0, db_setup_1.initDb)((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected to mongoDb");
        app.listen(5000, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("running on port 5000");
        }));
    }
});
