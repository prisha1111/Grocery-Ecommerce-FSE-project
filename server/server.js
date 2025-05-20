const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./config/db.js"); // Sequelize connection
const { initializeDatabase } = require("./config/init-db.js");

const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize MySQL Database connection using Sequelize
sequelize.authenticate()
  .then(() => {
    console.log("MySQL database connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Initialize database models and relationships (if needed)
initializeDatabase();

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
