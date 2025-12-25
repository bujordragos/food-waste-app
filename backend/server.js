// main entry point for the backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// import models
const User = require('./models/User');
const Product = require('./models/Product');
const Group = require('./models/Group');

// import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes configuration
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

// base route
app.get('/', (req, res) => {
    res.send('food waste app backend works!');
});

// start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        // keeps models in sync with db structure
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