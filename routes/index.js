import express from "express";
import { homePage } from "../controllers/homeController.js";
const router = express.Router();
router.get("/", homePage);

import { authController } from "../controllers/authController.js";

router.get("/register/view", authController.registerView);
router.get("/forgot-password/view", authController.forgotPasswordView);
router.get("/dashboard/view", authController.dashboardView);
router.get("/login/view", authController.loginView);

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/logout", authController.logoutUser);

import { productController } from "../controllers/productController.js";

router.get("/products/:id", productController.show);
router.get("/products", productController.index);
router.get("/products", productController.store);

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
