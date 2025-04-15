const { db } = require("../config/db")
const bcrypt = require("bcrypt")

const UserModel = {
  findByEmail: async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0]
  },

  findById: async (id) => {
    const result = await db.query("SELECT id, name, email, created_at FROM users WHERE id = $1", [id])
    return result.rows[0]
  },

  create: async (userData) => {
    const { name, email, password } = userData

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    )

    return result.rows[0]
  },

  validatePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
  },
}

module.exports = UserModel
