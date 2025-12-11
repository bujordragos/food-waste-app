require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

// import models
const User = require('./models/User');
const Product = require('./models/Product');
const Group = require('./models/Group');

// import routes
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// routes configuration
app.use('/api/products', productRoutes);

// base route
app.get('/', (req, res) => {
    res.send('Food Waste App Backend is Running!');
});

// start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        // sync models
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