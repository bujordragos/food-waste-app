const { Sequelize } = require('sequelize');
require('dotenv').config();

// connect to cloud db
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // needed for ssl
        }
    },
    logging: false // set to true to show sql logs
});

module.exports = sequelize;