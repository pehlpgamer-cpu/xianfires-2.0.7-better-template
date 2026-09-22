import express from "express";
import { homePage } from "../app/http/controllers/homeController.js";
const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "api v1 test successful!" });
});

export default router;
