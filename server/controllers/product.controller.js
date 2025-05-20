const { Product } = require("../config/init-db.js"); // Ensure your Sequelize models/instance are exported properly
const path = require("path");
const fs = require("fs");
const { sequelize } = require("../config/db.js");
const { Op } = require("sequelize");

const ProductController = {
  addProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ message: "Name, price, and category are required" });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await Product.create({
        name,
        description,
        price,
        image: imagePath,
        stock: stock || 0,
        category,
      });

      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.error("Add product error:", error);
      res.status(500).json({ message: "Server error while adding product" });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const { category, search } = req.query;

      // Apply filters to find products based on category or search
      const where = {};
      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      const products = await Product.findAll({
        where,
        order: [["created_at", "DESC"]], // Ensure 'created_at' is included in your model
      });

      res.status(200).json({ products });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Server error while fetching products" });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ product });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Server error while fetching product" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;

      const currentProduct = await Product.findByPk(id);
      if (!currentProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      let imagePath = currentProduct.image;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;

        // Delete the old image if it is not a default image
        if (currentProduct.image && !currentProduct.image.includes("default")) {
          const oldImagePath = path.join(__dirname, "..", currentProduct.image.replace("/uploads/", "uploads/"));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      await currentProduct.update({
        name: name || currentProduct.name,
        description: description || currentProduct.description,
        price: price || currentProduct.price,
        image: imagePath,
        stock: stock !== undefined ? stock : currentProduct.stock,
        category: category || currentProduct.category,
      });

      res.status(200).json({
        message: "Product updated successfully",
        product: currentProduct,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error while updating product" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete the image if it's not the default one
      if (product.image && !product.image.includes("default")) {
        const imagePath = path.join(__dirname, "..", product.image.replace("/uploads/", "uploads/"));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.destroy(); // Delete the product from the database

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Server error while deleting product" });
    }
  },
};

module.exports = ProductController;
