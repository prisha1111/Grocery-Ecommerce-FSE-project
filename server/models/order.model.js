const { Order, OrderItem, User, Product } = require("../config/init-db.js");
const { Op } = require("sequelize");

const OrderModel = {
  create: async (orderData) => {
    const { userId, totalAmount, name, address, phone, pincode, paymentMethod } = orderData;

    const newOrder = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      name,
      address,
      phone,
      pincode,
      payment_method: paymentMethod,
    });

    return newOrder;
  },

  addOrderItem: async (orderItem) => {
    const { orderId, productId, quantity, price } = orderItem;

    await OrderItem.create({
      order_id: orderId,
      product_id: productId,
      quantity,
      price,
    });
  },

  findAll: async (filters = {}) => {
    const { status, search } = filters;
    const where = {};
    const userWhere = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];

      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const orders = await Order.findAll({
      where,
      include: {
        model: User,
        attributes: ["name", "email"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
      },
      order: [["created_at", "DESC"]],
    });

    return orders;
  },

  findByUserId: async (userId) => {
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
    return orders;
  },

  findById: async (id) => {
    const order = await Order.findOne({
      where: { id },
      include: {
        model: User,
        attributes: ["name", "email"],
      },
    });

    return order;
  },

  findOrderItems: async (orderId) => {
    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      include: {
        model: Product,
        attributes: ["name", "image"],
      },
    });

    return items;
  },

  updateStatus: async (id, status) => {
    const order = await Order.findByPk(id);
    if (!order) return null;

    order.status = status;
    await order.save();

    return order;
  },

  delete: async (id) => {
    await Order.destroy({ where: { id } });
  },
};

module.exports = OrderModel;
