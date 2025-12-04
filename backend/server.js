require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Group = require('./models/Group');

// Import Routes
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Register Routes
// This tells Express: "If the URL starts with /api/products, go to productRoutes.js"
app.use('/api/products', productRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Food Waste App Backend is Running!');
});

// Start Server & Connect to DB
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        // Sync models
        await sequelize.sync({ alter: true }); 
        console.log('✅ Models synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();