const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // We need the User to link them

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING, // e.g., "Vegetarians", "Office"
        defaultValue: 'General'
    }
});

// The Magic Many-to-Many Link
// This creates a hidden table called "UserGroups" to track who is in what group
Group.belongsToMany(User, { through: 'UserGroups' });
User.belongsToMany(Group, { through: 'UserGroups' });

module.exports = Group;