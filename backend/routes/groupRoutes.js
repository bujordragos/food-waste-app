const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/groups - get all groups i am part of
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Group, through: { attributes: [] } }]
        });
        res.json(user.Groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/groups/:id/members - get members of a group
router.get('/:id/members', auth, async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [{ 
                model: User, 
                attributes: ['id', 'username', 'email', 'dietaryTags'],
                through: { attributes: [] } 
            }]
        });
        if (!group) return res.status(404).json({ error: 'group not found' });
        res.json({
            members: group.Users,
            adminId: group.adminId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/groups - create a new group
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const newGroup = await Group.create({ 
            name, 
            description, 
            category,
            adminId: req.user.id // set the creator as admin
        });
        
        // add the creator to the group
        await newGroup.addUser(req.user.id);
        
        res.status(201).json(newGroup);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/groups/:id/members/:userId - remove a member (Admin only)
router.delete('/:id/members/:userId', auth, async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'group not found' });
        
        // security check: only the admin can remove people
        if (group.adminId !== req.user.id) {
            return res.status(403).json({ error: 'only the group admin can remove members' });
        }

        // prevent admin from removing themselves
        if (parseInt(req.params.userId) === req.user.id) {
            return res.status(400).json({ error: 'you cannot remove yourself from the group' });
        }

        const userToRemove = await User.findByPk(req.params.userId);
        if (!userToRemove) return res.status(404).json({ error: 'user not found' });

        await group.removeUser(userToRemove);
        res.json({ message: 'member removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/groups/:id/join - join an existing group
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'group not found' });
        
        await group.addUser(req.user.id);
        res.json({ message: 'joined group successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/groups/:id/invite - invite a friend by email
router.post('/:id/invite', auth, async (req, res) => {
    try {
        const { email } = req.body;
        const group = await Group.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'group not found' });

        const friend = await User.findOne({ where: { email } });
        if (!friend) return res.status(404).json({ error: 'user not found' });

        await group.addUser(friend.id);
        res.json({ message: 'friend added to group' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
