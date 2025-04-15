const express = require("express")
const router = express.Router()
const DashboardController = require("../controllers/dashboard.controller")
const { authenticateToken } = require("../config/jwt")

router.get("/dashboard/stats", authenticateToken, DashboardController.getStats)

module.exports = router
