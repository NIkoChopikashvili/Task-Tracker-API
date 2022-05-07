import express from "express";
import * as taskController from "../../controllers/task.controller";
import { isAuth } from "../../middleware/userAuth";

const router = express.Router();

router.post("/createTask", taskController.createTask);

export default router;
