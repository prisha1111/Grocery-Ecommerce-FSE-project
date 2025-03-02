import { DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    mobile: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ""
    },
    verify_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    last_login_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM("Active", "Inactive", "Suspended"),
        allowNull: false,
        defaultValue: "Active"
    },
    forgot_password_otp: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    forgot_password_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "USER"),
        allowNull: false,
        defaultValue: "USER"
    }
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt columns
    tableName: 'users'
});

export default User;
