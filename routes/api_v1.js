import express from "express";
const router = express.Router();

import healthController from "../app/http/controllers/api/v1/healthController.js";

router.get("/up", healthController.up);
router.get("/health", healthController.health);

export default router;
