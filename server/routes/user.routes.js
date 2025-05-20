const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.controller.js")
const { authenticateToken } = require("../config/jwt.js")

router.post("/register", UserController.register)

router.post("/login", UserController.login)

router.get("/user", authenticateToken, UserController.getProfile)

module.exports = router
