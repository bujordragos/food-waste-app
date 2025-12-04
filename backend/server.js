require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db'); // Import the DB config we just made

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Group = require('./models/Group');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Food Waste App Backend is Running!');
});

// The magic starts here
const startServer = async () => {
    try {
        // 1. Try to connect to the DB
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        // 2. Sync models (we'll add these next)
        await sequelize.sync({ alter: true }); 
        console.log('✅ Models synced (Tables created).');
        
        // 3. Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();