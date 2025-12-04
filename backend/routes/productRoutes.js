const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products - Add a new product to the fridge
router.post('/', async (req, res) => {
    try {
        // We assume the user sends data like { name: "Milk", category: "Dairy", ... }
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id - Update a product (e.g., mark as available)
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/products/:id - Eat/Throw away food
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/scan/:barcodeg - Fetch product details from OpenFoodFacts
router.get('/scan/:barcode', async (req, res) => {
    try {
        const { barcode } = req.params;
        // This fetches real data from the OpenFoodFacts API
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
            res.json({
                name: data.product.product_name,
                image: data.product.image_url,
                brand: data.product.brands
            });
        } else {
            res.status(404).json({ error: 'Product not found in external database' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch external data' });
    }
});

module.exports = router;