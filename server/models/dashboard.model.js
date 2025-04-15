const { db } = require("../config/db")

const DashboardModel = {
  getTotalProducts: async () => {
    const result = await db.query("SELECT COUNT(*) FROM products")
    return Number.parseInt(result.rows[0].count)
  },

  getTotalOrders: async () => {
    const result = await db.query("SELECT COUNT(*) FROM orders")
    return Number.parseInt(result.rows[0].count)
  },

  getTotalRevenue: async () => {
    const result = await db.query("SELECT SUM(total_amount) FROM orders WHERE status != 'cancelled'")
    return Number.parseFloat(result.rows[0].sum || 0)
  },

  getOrdersByStatus: async () => {
    const result = await db.query(`
      SELECT status, COUNT(*) 
      FROM orders 
      GROUP BY status
    `)
    return result.rows
  },

  getTopProducts: async () => {
    const result = await db.query(`
      SELECT p.id, p.name, p.image, SUM(oi.quantity) as total_sold
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name, p.image
      ORDER BY total_sold DESC
      LIMIT 5
    `)
    return result.rows
  },

  getRecentOrders: async () => {
    const result = await db.query(`
      SELECT o.*, u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `)
    return result.rows
  },

  getSalesByCategory: async () => {
    const result = await db.query(`
      SELECT p.category, SUM(oi.quantity * oi.price) as total_sales
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.category
      ORDER BY total_sales DESC
    `)
    return result.rows
  },

  getMonthlySales: async () => {
    const result = await db.query(`
      SELECT 
        TO_CHAR(o.created_at, 'YYYY-MM') as month,
        SUM(o.total_amount) as total_sales
      FROM orders o
      WHERE o.status != 'cancelled'
      AND o.created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `)
    return result.rows
  },
}

module.exports = DashboardModel
