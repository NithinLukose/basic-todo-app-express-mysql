const express = require("express");
const { signupUser, userLogin } = require("../controller/authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", userLogin);

module.exports = router;
