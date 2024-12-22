const mysql = require("mysql2");
class QueryBuilder {
  constructor(pool, tableName, validColumns) {
    this.pool = pool;
    this.tableName = tableName;
    this.validColumns = validColumns;
  }

  isValidColumn(column) {
    return this.validColumns.includes(column);
  }

  isValidSortOrder(order) {
    return ["asc", "desc"].includes(order.toLowerCase());
  }

  buildWhereClause(filters) {
    const whereClauses = [];
    const values = [];

    for (const [column, value] of Object.entries(filters)) {
      if (this.isValidColumn(column)) {
        whereClauses.push(`${mysql.escapeId(column)} = ?`);
        values.push(value);
      } else {
        throw new Error(`Invalid filter column: ${column}`);
      }
    }

    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    return { whereClause, values };
  }

  buildOrderByClause(sort) {
    if (!sort) return "";
    const { column, order } = sort;
    if (this.isValidColumn(column) && this.isValidSortOrder(order)) {
      return `ORDER BY ${mysql.escapeId(column)} ${order.toUpperCase()}`;
    } else {
      throw new Error(
        `Invalid sort parameters: column=${column}, order=${order}`
      );
    }
  }
  buildSelectClause(fields) {
    if (!fields) return "*"; // Default: select all columns
    const selectedColumns = fields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => this.isValidColumn(field));
    if (selectedColumns.length === 0)
      throw new Error("No valid columns in fields parameter");
    return selectedColumns.map((column) => mysql.escapeId(column)).join(", ");
  }

  async fetch(filters, sort, fields) {
    const selectClause = this.buildSelectClause(fields);
    const { whereClause, values } = this.buildWhereClause(filters);
    const orderByClause = this.buildOrderByClause(sort);

    const query = `SELECT ${selectClause} FROM ${mysql.escapeId(
      this.tableName
    )} ${whereClause} ${orderByClause}`;
    const [rows] = await this.pool.query(query, values);
    return rows;
  }
}

module.exports = QueryBuilder;
