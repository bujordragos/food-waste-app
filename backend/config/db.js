const { Sequelize } = require('sequelize');
require('dotenv').config();

// This initializes the connection to your cloud DB
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Neon/Supabase/Heroku connections
        }
    },
    logging: false // Set to true if you want to see raw SQL queries in terminal
});

module.exports = sequelize;