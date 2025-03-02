import { DataTypes } from 'sequelize';

const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.JSON, // Storing image array in JSON format
        defaultValue: []
    },
    unit: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    discount: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ""
    },
    more_details: {
        type: DataTypes.JSON, // Storing additional product details as JSON
        defaultValue: {}
    },
    publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'products'
});

// Many-to-Many Relationship with Categories
ProductModel.belongsToMany(CategoryModel, { through: 'ProductCategories', foreignKey: 'productId' });
CategoryModel.belongsToMany(ProductModel, { through: 'ProductCategories', foreignKey: 'categoryId' });

// Many-to-Many Relationship with SubCategories
ProductModel.belongsToMany(SubCategoryModel, { through: 'ProductSubCategories', foreignKey: 'productId' });
SubCategoryModel.belongsToMany(ProductModel, { through: 'ProductSubCategories', foreignKey: 'subCategoryId' });

export default ProductModel;