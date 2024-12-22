const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // console.log("send token");
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signupUser = async (req, res, next) => {
  const newUser = await User.signup(req.body);
  if (!newUser) {
    res.status(401).json({
      status: "fail",
      data: {
        message: "password and passwordConfirm doesn't match",
      },
    });
    return;
  }
  res.status(201).json(newUser);
};

exports.userLogin = async (req, res) => {
  const user = await User.login(req.body);
  if (!user) {
    res.status(401).json({
      status: "fail",
      data: {
        message: "incorrect email or password",
      },
    });
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      message: "logged in successfully",
    },
  });
};
