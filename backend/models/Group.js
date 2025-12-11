const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // link users

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
        type: DataTypes.STRING, // e.g. "Vegetarians"
        defaultValue: 'General'
    }
});

// many to many relation
// junction table
Group.belongsToMany(User, { through: 'UserGroups' });
User.belongsToMany(Group, { through: 'UserGroups' });

module.exports = Group;