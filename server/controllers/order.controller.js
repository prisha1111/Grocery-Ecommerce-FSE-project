const OrderModel = require("../models/order.model.js");
const ProductModel = require("../models/product.model.js");
const { sequelize } = require("../config/db.js"); // Sequelize instance

const OrderController = {
  createOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { items, totalAmount, name, address, phone, pincode, paymentMethod } = req.body;

      if (!items || !items.length || !totalAmount || !name || !address || !phone || !pincode || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const order = await OrderModel.create({
        userId: req.user.id,
        totalAmount,
        name,
        address,
        phone,
        pincode,
        paymentMethod,
      }, { transaction: t });

      for (const item of items) {
        await OrderModel.addOrderItem({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }, t);

        await ProductModel.updateStock(item.id, item.quantity, t);
      }

      await t.commit();

      res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      await t.rollback();
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error while creating order" });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const { status, search } = req.query;
      const orders = await OrderModel.findAll({ status, search });

      for (const order of orders) {
        order.items = await OrderModel.findOrderItems(order.id);
      }

      res.status(200).json({ orders });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Server error while fetching orders" });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const orders = await OrderModel.findByUserId(req.user.id);

      for (const order of orders) {
        order.items = await OrderModel.findOrderItems(order.id);
      }

      res.status(200).json({ orders });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Server error while fetching user orders" });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await OrderModel.findById(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.items = await OrderModel.findOrderItems(id);

      res.status(200).json({ order });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Server error while fetching order" });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const orderExists = await OrderModel.findById(id);
      if (!orderExists) {
        return res.status(404).json({ message: "Order not found" });
      }

      const order = await OrderModel.updateStatus(id, status);

      res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Server error while updating order status" });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const orderExists = await OrderModel.findById(id);
      if (!orderExists) {
        return res.status(404).json({ message: "Order not found" });
      }

      await OrderModel.delete(id);

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ message: "Server error while deleting order" });
    }
  },
};

module.exports = OrderController;
