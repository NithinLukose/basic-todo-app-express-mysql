const Todo = require("../models/todoModel.js");

const getAllTodos = async (req, res) => {
  try {
    const sortBy = req.query.sortBy;
    const order = req.query.order || "asc"; // Default to ascending if not provided

    // Extract filters by removing sortBy and order
    const { sortBy: _, order: __, fields, ...filters } = req.query;

    // Prepare sorting object
    const sort = sortBy ? { column: sortBy, order } : null;
    const todos = await Todo.getAll(filters, sort, fields);
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTodo = async (req, res) => {
  const newTodo = await Todo.create(req.body);
  res.status(201).json(newTodo);
};

const updateTodo = async (req, res) => {
  const updatedTodo = await Todo.update(req.params.id, req.body);
  res.json(updatedTodo);
};

const deleteTodo = async (req, res) => {
  await Todo.delete(req.params.id);
  res.status(204).send();
};

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo };
