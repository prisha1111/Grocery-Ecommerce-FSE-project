

const express = require("express")
const cors = require("cors")
const path = require("path")
const { connectDB } = require("./config/db")
const { initializeDatabase } = require("./config/init-db")

const userRoutes = require("./routes/user.routes")
const productRoutes = require("./routes/product.routes")
const orderRoutes = require("./routes/order.routes")
const dashboardRoutes = require("./routes/dashboard.routes")

const app = express()

app.use(express.json())
app.use(cors())

connectDB()

initializeDatabase()

app.use("/api", userRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", dashboardRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
