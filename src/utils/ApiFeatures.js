class APIFeatures {
  constructor(tableName, queryString) {
    this.table = tableName;
    this.queryObj = queryString;
  }
  main() {
    return ` Select ${this.limitFields()} from ${
      this.table
    }  ${this.filter()} ${this.sort()}`;
  }
  filter() {
    const query = { ...this.queryObj };
    const excludedFeatures = ["sort", "fields"];
    excludedFeatures.forEach((feat) => delete query[feat]);
    if (Object.keys(query).length > 0) {
      const queryString = Object.keys(query).reduce(
        (acc, curr, currIndex, arr) =>
          acc +
          ` ${curr}=${query[curr]} ${
            currIndex !== arr.length - 1 ? "AND" : ""
          }`,
        "where"
      );
      return queryString;
    }

    return "";
  }
  limitFields() {
    if (this.queryObj.fields) {
      return this.queryObj.fields;
    }
    return "*";
  }
  sort() {
    if (this.queryObj.sort) {
      const clauses = [];
      const sortParams = this.queryObj.sort.split(",").map((s) => s.split(":"));
      for (const [column, order] of sortParams) {
        clauses.push(`${column} ${order.toUpperCase()}`);
      }
      return `ORDER BY ${clauses.join(", ")}`;
    }
    return "";
  }
}

module.exports = APIFeatures;
