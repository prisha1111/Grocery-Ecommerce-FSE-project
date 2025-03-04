import express from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);

export default router;
