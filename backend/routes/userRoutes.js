const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/profile - Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['username', 'email', 'dietaryTags', 'bio', 'phone']
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/users/profile - Update profile
router.post('/profile', auth, async (req, res) => {
    try {
        const { bio, dietaryTags, phone } = req.body;
        await User.update(
            { bio, dietaryTags, phone },
            { where: { id: req.user.id } }
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
