const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('data', 'root', 'Ps@ini@123', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306, // default MySQL port
  logging: false, // optional: disable SQL logging
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
