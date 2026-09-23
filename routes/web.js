import express from "express";
const router = express.Router();
import { RouteBuilder } from "../src/RouteBuilder.js";
const routeBuilder = new RouteBuilder(router);

import { homePage } from "../app/http/controllers/homeController.js";
import userController from "../app/http/controllers/userController.js";
import authController from "../app/http/controllers/authController.js";
import auditTrailController from "../app/http/controllers/auditTrailController.js";

router.get("/", homePage);

router.get("/register-page", authController.registerPage);
router.get("/forgot-password-page", authController.forgotPasswordPage);
router.get("/dashboard-page", authController.dashboardPage);
router.get("/login-page", authController.loginPage);

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);


routeBuilder.resource("/users", userController)
routeBuilder.resource("/audit-trail", auditTrailController)
export default router;
