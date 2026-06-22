import express from "express";
import { trackVisitor } from "../controllers/visitorController.js";

const router = express.Router();

router.post("/track", trackVisitor);

export default router;