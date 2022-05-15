import express from "express";
import * as taskController from "../../controllers/task.controller";
import { isAuth } from "../../middleware/userAuth";

const router = express.Router();

//POST
router.post("/createTask", taskController.createTask);

//GET
router.get("/getTask", taskController.getSingleTask);

//DELETE
router.delete("/deleteTask", taskController.deleteTask);

export default router;
