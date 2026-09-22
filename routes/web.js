import express from "express";
import { homePage } from "../app/http/controllers/homeController.js";
const router = express.Router();
router.get("/", homePage);

import { authController } from "../app/http/controllers/authController.js";

router.get("/register-page", authController.registerPage);
router.get("/forgot-password-page", authController.forgotPasswordPage);
router.get("/dashboard-page", authController.dashboardPage);
router.get("/login-page", authController.loginPage);

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

import { productController } from "../app/http/controllers/productController.js";

router.get("/products/:id", productController.show);
router.get("/products", productController.index);
router.post("/products", productController.store);

export default router;
