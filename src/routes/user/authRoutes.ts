import express from "express";
import * as authController from "../../controllers/auth.controller";

const router = express.Router();

router.post("/signUp", authController.userSignUp);
router.post("/login", authController.userSignIn);
router.post("/refresh", authController.refreshToken);

export default router;
