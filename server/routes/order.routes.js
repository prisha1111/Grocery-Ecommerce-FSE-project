const express = require("express")
const router = express.Router()
const OrderController = require("../controllers/order.controller.js")
const { authenticateToken } = require("../config/jwt.js")

router.post("/orders", authenticateToken, OrderController.createOrder)

router.get("/orders", authenticateToken, OrderController.getAllOrders)

router.get("/user/orders", authenticateToken, OrderController.getUserOrders)

router.get("/orders/:id", authenticateToken, OrderController.getOrderById)

router.put("/orders/:id/status", authenticateToken, OrderController.updateOrderStatus)

router.delete("/orders/:id", authenticateToken, OrderController.deleteOrder)

module.exports = router
