const { Product, Order, OrderItem, User } = require('../config/init-db.js');
const { sequelize }=require('../config/db.js');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");

const DashboardModel = {
  getTotalProducts: async () => {
    const count = await Product.count();
    return count;
  },

  getTotalOrders: async () => {
    const count = await Order.count();
    return count;
  },

  getTotalRevenue: async () => {
    const result = await Order.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue']
      ],
      where: {
        status: { [Op.ne]: 'cancelled' }
      },
      raw: true,
    });
    return parseFloat(result.totalRevenue || 0);
  },

  getOrdersByStatus: async () => {
    const results = await Order.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status'],
      raw: true,
    });
    return results;
  },

  getTopProducts: async () => {
    const results = await sequelize.query(`
      SELECT p.id, p.name, p.image, SUM(oi.quantity) AS total_sold
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name, p.image
      ORDER BY total_sold DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT });

    return results;
  },

  getRecentOrders: async () => {
    const results = await sequelize.query(`
      SELECT o.*, u.name AS user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT });

    return results;
  },

  getSalesByCategory: async () => {
    const results = await sequelize.query(`
      SELECT p.category, SUM(oi.quantity * oi.price) AS total_sales
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.category
      ORDER BY total_sales DESC
    `, { type: QueryTypes.SELECT });

    return results;
  },

  getMonthlySales: async () => {
    const results = await sequelize.query(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') AS month,
        SUM(o.total_amount) AS total_sales
      FROM orders o
      WHERE o.status != 'cancelled'
        AND o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `, { type: QueryTypes.SELECT });

    return results;
  },
};

module.exports = DashboardModel;
