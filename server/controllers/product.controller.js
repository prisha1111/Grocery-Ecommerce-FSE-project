const ProductModel = require("../models/product.model")
const path = require("path")
const fs = require("fs")

const ProductController = {
  addProduct: async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body

      if (!name || !price || !category) {
        return res.status(400).json({ message: "Name, price, and category are required" })
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null

      const product = await ProductModel.create({
        name,
        description,
        price,
        image: imagePath,
        stock: stock || 0,
        category,
      })

      res.status(201).json({
        message: "Product added successfully",
        product,
      })
    } catch (error) {
      console.error("Add product error:", error)
      res.status(500).json({ message: "Server error while adding product" })
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const { category, search } = req.query

      const products = await ProductModel.findAll({ category, search })

      res.status(200).json({ products })
    } catch (error) {
      console.error("Get products error:", error)
      res.status(500).json({ message: "Server error while fetching products" })
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id)

      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }

      res.status(200).json({ product })
    } catch (error) {
      console.error("Get product error:", error)
      res.status(500).json({ message: "Server error while fetching product" })
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params
      const { name, description, price, stock, category } = req.body

      const currentProduct = await ProductModel.findById(id)
      if (!currentProduct) {
        return res.status(404).json({ message: "Product not found" })
      }

      let imagePath = currentProduct.image
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`

        await ProductModel.deleteImage(currentProduct.image)
      }

      const product = await ProductModel.update(id, {
        name: name || currentProduct.name,
        description: description || currentProduct.description,
        price: price || currentProduct.price,
        image: imagePath,
        stock: stock !== undefined ? stock : currentProduct.stock,
        category: category || currentProduct.category,
      })

      res.status(200).json({
        message: "Product updated successfully",
        product,
      })
    } catch (error) {
      console.error("Update product error:", error)
      res.status(500).json({ message: "Server error while updating product" })
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id)
      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }

      await ProductModel.deleteImage(product.image)

      await ProductModel.delete(id)

      res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
      console.error("Delete product error:", error)
      res.status(500).json({ message: "Server error while deleting product" })
    }
  },
}

module.exports = ProductController
