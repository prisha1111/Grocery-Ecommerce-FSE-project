import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId; // From auth middleware

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid product or quantity" });
        }

        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if the product is already in the cart
        let cartItem = await Cart.findOne({ where: { userId, productId } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({ userId, productId, quantity });
        }

        res.json({ message: "Product added to cart", data: cartItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Product, attributes: ["name", "price"] }]
        });

        res.json({ message: "Cart fetched successfully", data: cartItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


