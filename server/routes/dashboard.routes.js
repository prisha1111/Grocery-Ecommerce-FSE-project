const express = require("express")
const router = express.Router()
const DashboardController = require("../controllers/dashboard.controller.js")
const { authenticateToken } = require("../config/jwt.js")

router.get("/dashboard/stats", authenticateToken, DashboardController.getStats)

module.exports = router
