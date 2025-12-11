const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // link to user

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
        type: DataTypes.STRING, // e.g. "Dairy"
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.DATEONLY, // date only
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // default false
    }
});

// relations
// user has many products
User.hasMany(Product, { onDelete: 'CASCADE' });
// product belongs to user
Product.belongsTo(User);

module.exports = Product;