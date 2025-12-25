const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/products/explore - get all available products that don't belong to the logged-in user
router.get('/explore', auth, async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                isAvailable: true,
                UserId: { [Op.ne]: req.user.id } 
            },
            include: [{ model: User, attributes: ['username'] }]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// PATCH /api/products/:id/available - toggle availability for sharing
router.patch('/:id/available', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'product not found' });
        
        // only owner can share
        if (product.UserId !== req.user.id) {
            return res.status(403).json({ error: 'not authorized' });
        }

        product.isAvailable = !product.isAvailable;
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products/:id/claim - claim a product
router.post('/:id/claim', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'product not found' });

        if (!product.isAvailable) {
            return res.status(400).json({ error: 'product not available for sharing' });
        }

        // can't claim your own product
        if (product.UserId === req.user.id) {
            return res.status(400).json({ error: 'cannot claim your own product' });
        }

        // transfer ownership to the claimer
        product.UserId = req.user.id;
        product.isAvailable = false; // no longer available once claimed
        await product.save();

        res.json({ message: 'product claimed successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;