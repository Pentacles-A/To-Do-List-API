const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a todo
router.post('/', auth, async (req, res) => {
    try {
        const todo = new Todo({
            ...req.body,
            user: req.user.id
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all todos with pagination, search, and filters
router.get('/', auth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            priority,
            category,
            completed,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = { user: req.user.id };
        
        // Search
        if (search) {
            query.$text = { $search: search };
        }
        
        // Filters
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (completed) query.completed = completed === 'true';

        // Count total
        const total = await Todo.countDocuments(query);

        // Get todos
        const todos = await Todo.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            todos,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalTodos: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single todo
router.get('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk operations
router.post('/bulk', auth, async (req, res) => {
    try {
        const { operation, todoIds } = req.body;
        
        switch (operation) {
            case 'complete':
                await Todo.updateMany(
                    { _id: { $in: todoIds }, user: req.user.id },
                    { completed: true }
                );
                break;
            case 'delete':
                await Todo.deleteMany(
                    { _id: { $in: todoIds }, user: req.user.id }
                );
                break;
            default:
                return res.status(400).json({ message: 'Invalid operation' });
        }
        
        res.json({ message: 'Bulk operation successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get todo statistics
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const stats = await Todo.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: ['$completed', 1, 0] } },
                    overdue: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $lt: ['$dueDate', new Date()] },
                                    { $eq: ['$completed', false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json(stats[0] || { total: 0, completed: 0, overdue: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 