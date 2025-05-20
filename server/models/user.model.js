const { User } = require("../config/init-db.js"); // Make sure to export the User model from Sequelize configuration
const bcrypt = require("bcrypt");

const UserModel = {
  findByEmail: async (email) => {
    // Using Sequelize's `findOne` method to query the database for a user by email
    const user = await User.findOne({
      where: { email },
    });
    return user ? user.toJSON() : null; // Return the user as a plain object if found
  },

  findById: async (id) => {
    // Using Sequelize's `findOne` method to query the database for a user by ID
    const user = await User.findOne({
      attributes: ["id", "name", "email", "created_at"],
      where: { id },
    });
    return user ? user.toJSON() : null; // Return the user as a plain object if found
  },

  create: async (userData) => {
    const { name, email, password } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Using Sequelize's `create` method to insert a new user into the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user.toJSON(); // Return the user object as plain data
  },

  validatePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};

module.exports = UserModel;
