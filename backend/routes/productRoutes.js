const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET /api/products - get all products for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.findAll({ where: { UserId: req.user.id } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products - add product
router.post('/', auth, async (req, res) => {
    try {
        // link product to the logged-in user
        const newProduct = await Product.create({
            ...req.body,
            UserId: req.user.id
        });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id - update product
router.put('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/scan/:barcode - fetch from openfoodfacts
router.get('/scan/:barcode', auth, async (req, res) => {
    try {
        const { barcode } = req.params;
        // fetch data from external api
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
            // prioritize Romanian or English names if available
            const name = data.product.product_name_ro || 
                         data.product.product_name_en || 
                         data.product.product_name;

            res.json({
                name: name,
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