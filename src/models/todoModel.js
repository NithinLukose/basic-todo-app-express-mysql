const pool = require("../config/database");
const QueryBuilder = require("../utils/QueryBuilder");

class Todo {
  constructor(pool) {
    this.pool = pool;
    this.queryBuilder = new QueryBuilder(pool, "todos", [
      "title",
      "description",
      "updatedAt",
      "createdAt",
      "isCompleted",
    ]);
  }
  async getAll(filters, sort, fields) {
    const todos = await this.queryBuilder.fetch(filters, sort, fields);
    return todos;
  }
  async create(todo) {
    const { title, description } = todo;
    const [result] = await this.pool.query(
      "INSERT INTO todos (title, description) VALUES (?, ?)",
      [title, description]
    );
    return {
      id: result.insertId,
      ...todo,
    };
  }
  async update(id, todo) {
    const { title, description, isCompleted } = todo;
    await this.pool.query(
      "UPDATE todos SET title = ?, description = ?, isCompleted = ? WHERE id = ?",
      [title, description, isCompleted, id]
    );
    return { id, ...todo };
  }
  async delete(id) {
    await this.pool.query("DELETE FROM todos WHERE id = ?", [id]);
  }
}

module.exports = new Todo(pool);
