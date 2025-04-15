const DashboardModel = require("../models/dashboard.model")

const DashboardController = {
  getStats: async (req, res) => {
    try {
      const totalProducts = await DashboardModel.getTotalProducts()

      const totalOrders = await DashboardModel.getTotalOrders()

      const totalRevenue = await DashboardModel.getTotalRevenue()

      const ordersByStatus = await DashboardModel.getOrdersByStatus()

      const topProducts = await DashboardModel.getTopProducts()

      const recentOrders = await DashboardModel.getRecentOrders()

      const salesByCategory = await DashboardModel.getSalesByCategory()

      const monthlySales = await DashboardModel.getMonthlySales()

      res.status(200).json({
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        topProducts,
        recentOrders,
        salesByCategory,
        monthlySales,
      })
    } catch (error) {
      console.error("Dashboard stats error:", error)
      res.status(500).json({ message: "Server error while fetching dashboard statistics" })
    }
  },
}

module.exports = DashboardController
