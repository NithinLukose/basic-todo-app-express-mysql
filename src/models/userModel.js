const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const correctPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

class User {
  async signup(user) {
    const { name, email, password, passwordConfirm } = user;
    if (password !== passwordConfirm) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("length", hashedPassword.length);
    const [result] = await pool.query(
      "INSERT INTO users (name, email,password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    return {
      id: result.insertId,
      ...user,
      password: hashedPassword,
      passwordConfirm: undefined,
    };
  }
  async login(user) {
    const { email, password } = user;
    const [result] = await pool.query(
      "select password from users where email = ?",
      email
    );
    if (result && (await correctPassword(password, result[0].password))) {
      return result;
    }

    return null;
  }
}

module.exports = new User();
