import { DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';
import UserModel from './user.model.js'; // Import User model for association

const AddressModel = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    address_line: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    city: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    pincode: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    mobile: {
        type: DataTypes.BIGINT,
        defaultValue: null
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,  // Foreign key reference to User table
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
    tableName: 'addresses'
});

// Define relationship
AddressModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserModel.hasMany(AddressModel, { foreignKey: 'userId', onDelete: 'CASCADE' });

export default AddressModel;
