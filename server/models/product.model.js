const { db } = require("../config/db")
const fs = require("fs")
const path = require("path")

const ProductModel = {
  findAll: async (filters = {}) => {
    const { category, search } = filters

    let query = "SELECT * FROM products"
    const queryParams = []

    if (category) {
      query += " WHERE category = $1"
      queryParams.push(category)
    }

    if (search) {
      if (category) {
        query += " AND (name ILIKE $2 OR description ILIKE $2)"
        queryParams.push(`%${search}%`)
      } else {
        query += " WHERE name ILIKE $1 OR description ILIKE $1"
        queryParams.push(`%${search}%`)
      }
    }

    query += " ORDER BY created_at DESC"

    const result = await db.query(query, queryParams)
    return result.rows
  },

  findById: async (id) => {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id])
    return result.rows[0]
  },

  create: async (productData) => {
    const { name, description, price, image, stock, category } = productData

    const result = await db.query(
      "INSERT INTO products (name, description, price, image, stock, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, image, stock || 0, category],
    )

    return result.rows[0]
  },

  update: async (id, productData) => {
    const { name, description, price, image, stock, category } = productData

    const result = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3, image = $4, stock = $5, category = $6 WHERE id = $7 RETURNING *",
      [name, description, price, image, stock, category, id],
    )

    return result.rows[0]
  },

  delete: async (id) => {
    await db.query("DELETE FROM products WHERE id = $1", [id])
  },

  deleteImage: async (imagePath) => {
    if (
      imagePath &&
      !imagePath.includes("default") &&
      fs.existsSync(path.join(__dirname, "..", imagePath.replace("/uploads/", "uploads/")))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", imagePath.replace("/uploads/", "uploads/")))
    }
  },

  updateStock: async (id, quantity) => {
    await db.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [quantity, id])
  },
}

module.exports = ProductModel
