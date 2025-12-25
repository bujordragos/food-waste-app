const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// get explore products
router.get('/explore', auth, async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                isAvailable: true,
                UserId: { [Op.ne]: req.user.id } 
            },
            include: [{ model: User, attributes: ['username', 'phone'] }]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get personal fridge items
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.findAll({ where: { UserId: req.user.id } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// add manual product
router.post('/', auth, async (req, res) => {
    try {
        // assign to current user
        const newProduct = await Product.create({
            ...req.body,
            UserId: req.user.id
        });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// edit product
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

// delete product
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

// external api scan
router.get('/scan/:barcode', auth, async (req, res) => {
    try {
        const { barcode } = req.params;
        // openfoodfacts fetch
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
            // prioritize ro or en labels
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

router.patch('/:id/available', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'product not found' });
        
        // ownership check
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

// claim marketplace item
router.post('/:id/claim', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['email', 'phone'] }]
        });
        if (!product) return res.status(404).json({ error: 'product not found' });
        if (!product.isAvailable) return res.status(400).json({ error: 'product not available' });
        if (product.UserId === req.user.id) return res.status(400).json({ error: 'cannot claim your own product' });

        const sellerEmail = product.User.email; 
        const sellerPhone = product.User.phone || '';

        product.UserId = req.user.id;
        product.isAvailable = false;
        // keep seller contact for history
        product.description = `Claimed: ${sellerEmail}${sellerPhone ? ' | Phone: ' + sellerPhone : ''}. ${product.description || ''}`;
        
        await product.save();
        res.json({ message: 'product claimed successfully', contact: sellerEmail, phone: sellerPhone });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;