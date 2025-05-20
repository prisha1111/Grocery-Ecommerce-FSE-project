const DashboardModel = require("../models/dashboard.model.js");

const DashboardController = {
  getStats: async (req, res) => {
    try {
      const [
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        topProducts,
        recentOrders,
        salesByCategory,
        monthlySales
      ] = await Promise.all([
        DashboardModel.getTotalProducts(),
        DashboardModel.getTotalOrders(),
        DashboardModel.getTotalRevenue(),
        DashboardModel.getOrdersByStatus(),
        DashboardModel.getTopProducts(),
        DashboardModel.getRecentOrders(),
        DashboardModel.getSalesByCategory(),
        DashboardModel.getMonthlySales()
      ]);

      res.status(200).json({
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        topProducts,
        recentOrders,
        salesByCategory,
        monthlySales,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Server error while fetching dashboard statistics" });
    }
  },
};

module.exports = DashboardController;
