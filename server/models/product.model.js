const { Product } = require("../config/init-db.js");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

const ProductModel = {
  findAll: async (filters = {}) => {
    const { category, search } = filters;
    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } }, // Use Op.like if iLike doesn't work in MySQL
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    return products;
  },

  findById: async (id) => {
    const product = await Product.findByPk(id);
    return product;
  },

  create: async (productData) => {
    const { name, description, price, image, stock = 0, category } = productData;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
      category,
    });

    return product;
  },

  update: async (id, productData) => {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await product.update(productData);

    return product;
  },

  delete: async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return;

    await product.destroy();
  },

  deleteImage: async (imagePath) => {
    if (
      imagePath &&
      !imagePath.includes("default") &&
      fs.existsSync(path.join(__dirname, "..", imagePath.replace("/uploads/", "uploads/")))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", imagePath.replace("/uploads/", "uploads/")));
    }
  },

  updateStock: async (id, quantity) => {
    const product = await Product.findByPk(id);
    if (!product) return;

    product.stock -= quantity;
    await product.save();
  },
};

module.exports = ProductModel;
