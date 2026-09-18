import express from "express";
import { homePage } from "../app/http/controllers/homeController.js";
const router = express.Router();
router.get("/", homePage);

import { authController } from "../app/http/controllers/authController.js";

router.get("/register/view", authController.registerView);
router.get("/forgot-password/view", authController.forgotPasswordView);
router.get("/dashboard/view", authController.dashboardView);
router.get("/login/view", authController.loginView);

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

import { productController } from "../app/http/controllers/productController.js";

router.get("/products/:id", productController.show);
router.get("/products", productController.index);
router.post("/products", productController.store);

//! WIP...
// import { routeBuilder, route } from "../utils/routing.js"
// routeBuilder(router, [{
//         prefix: "/products",
//         controller: productController,
//         r: [
//             route("get", "/:id", "show"),
//             route("get", "", "index"),
//             route("post", "", "store")
//         ],
//     }

// ]);

export default router;
