const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
const PORT = 3000;

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Connect to MongoDB
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

//load environment variables
dotenv.config();

//connect to MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Database connection error:', err));

//Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

//Adding routes for CRUD Operations
const Todo = require('./models/Todo');

// Create a new to-do:
app.post('/api/todos', async (req, res) => {
  console.log('Request body:', req.body); //log the request body
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error); // Log any errors
    res.status(400).json({ message: error.message });
  }
});

// Get all to-dos:
app.get('/api/todos', async (req, res) => {
  console.log('GET /api/todos endpoint hit');
  try {
    const todos = await Todo.find();
    console.log('Found todos:', todos);
    res.json(todos);
  } catch (err) {
    console.error('Error in GET /api/todos:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific to-do:
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'To-do not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a to-do:
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) return res.status(404).json({ message: 'To-do not found' });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a to-do:
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: 'To-do not found' });
    res.json({ message: 'To-do deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});