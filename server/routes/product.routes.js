const express = require("express")
const router = express.Router()
const ProductController = require("../controllers/product.controller")
const { authenticateToken } = require("../config/jwt")
const { upload } = require("../config/upload")

router.post("/products", authenticateToken, upload.single("image"), ProductController.addProduct)

router.get("/products", ProductController.getAllProducts)

router.get("/products/:id", ProductController.getProductById)

router.put("/products/:id", authenticateToken, upload.single("image"), ProductController.updateProduct)

router.delete("/products/:id", authenticateToken, ProductController.deleteProduct)

module.exports = router
