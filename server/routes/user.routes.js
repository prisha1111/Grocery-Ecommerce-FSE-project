const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.controller")
const { authenticateToken } = require("../config/jwt")

router.post("/register", UserController.register)

router.post("/login", UserController.login)

router.get("/user", authenticateToken, UserController.getProfile)

module.exports = router
