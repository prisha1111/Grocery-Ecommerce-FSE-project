const { db } = require("../config/db")

const OrderModel = {
  create: async (orderData) => {
    const { userId, totalAmount, name, address, phone, pincode, paymentMethod } = orderData

    const result = await db.query(
      "INSERT INTO orders (user_id, total_amount, name, address, phone, pincode, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [userId, totalAmount, name, address, phone, pincode, paymentMethod],
    )

    return result.rows[0]
  },

  addOrderItem: async (orderItem) => {
    const { orderId, productId, quantity, price } = orderItem

    await db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)", [
      orderId,
      productId,
      quantity,
      price,
    ])
  },

  findAll: async (filters = {}) => {
    const { status, search } = filters

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `
    const queryParams = []

    if (status) {
      query += " WHERE o.status = $1"
      queryParams.push(status)
    }

    if (search) {
      if (status) {
        query +=
          " AND (o.name ILIKE $2 OR o.address ILIKE $2 OR o.phone ILIKE $2 OR u.name ILIKE $2 OR u.email ILIKE $2)"
        queryParams.push(`%${search}%`)
      } else {
        query +=
          " WHERE o.name ILIKE $1 OR o.address ILIKE $1 OR o.phone ILIKE $1 OR u.name ILIKE $1 OR u.email ILIKE $1"
        queryParams.push(`%${search}%`)
      }
    }

    query += " ORDER BY o.created_at DESC"

    const result = await db.query(query, queryParams)
    return result.rows
  },

  findByUserId: async (userId) => {
    const result = await db.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    return result.rows
  },

  findById: async (id) => {
    const result = await db.query(
      `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `,
      [id],
    )
    return result.rows[0]
  },

  findOrderItems: async (orderId) => {
    const result = await db.query(
      `
      SELECT oi.*, p.name as product_name, p.image as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `,
      [orderId],
    )
    return result.rows
  },

  updateStatus: async (id, status) => {
    const result = await db.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id])
    return result.rows[0]
  },

  delete: async (id) => {
    await db.query("DELETE FROM orders WHERE id = $1", [id])
  },
}

module.exports = OrderModel
