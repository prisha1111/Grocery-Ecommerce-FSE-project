const { Client } = require("pg")

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "12345prisha",
  database: "Grochop",
})

const connectDB = async () => {
  try {
    await db.connect()
    console.log("Connected to PostgreSQL database")
  } catch (err) {
    console.error("Database connection error:", err)
    process.exit(1)
  }
}

module.exports = { db, connectDB }
