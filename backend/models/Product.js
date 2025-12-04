const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Import User to link them

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, // e.g., "Dairy", "Vegetables"
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.DATEONLY, // We only care about the date (YYYY-MM-DD), not time
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Default is "In my fridge, not for sharing" [cite: 9]
    }
});

// Relationships
// A User has many Products
User.hasMany(Product, { onDelete: 'CASCADE' });
// A Product belongs to one User
Product.belongsTo(User);

module.exports = Product;