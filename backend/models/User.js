const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
        // hashed with bcrypt
    },
    dietaryTags: {
        type: DataTypes.STRING, // e.g. "Vegetarian, Gluten-free"
        defaultValue: 'None'
    },
    bio: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING, // For WhatsApp integration
        defaultValue: ''
    }
});

module.exports = User;