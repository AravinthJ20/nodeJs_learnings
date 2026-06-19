const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const { title, author, year } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// Get All
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
