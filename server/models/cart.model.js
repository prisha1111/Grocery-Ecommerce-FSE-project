import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import User from "./user.model.js";
import Product from "./products.model.js";

const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: "id" } },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

export default Cart;
