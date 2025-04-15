const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/jwt")

const UserController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
      }

      const userExists = await UserModel.findByEmail(email)
      if (userExists) {
        return res.status(400).json({ message: "User with this email already exists" })
      }

      const user = await UserModel.create({ name, email, password })

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" })

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error during registration" })
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
      }

      const user = await UserModel.findByEmail(email)
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
      }

      const validPassword = await UserModel.validatePassword(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid email or password" })
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" })

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error during login" })
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.status(200).json({ user })
    } catch (error) {
      console.error("Get user error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
}

module.exports = UserController
