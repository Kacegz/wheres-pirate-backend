const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.setTimer = asyncHandler(async (req, res) => {
  req.session.userStart = new Date();
  console.log(req.session.userStart);
  res.json(true);
});
exports.stopTimer = asyncHandler(async (req, res) => {
  req.session.userFinish = new Date();
  console.log(req.session.userFinish);
  res.json(true);
});
exports.save = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ nickname: req.body.nickname }).exec();

  if (!exists) {
    const newUser = new User({
      nickname: req.body.nickname,
      startDate: req.session.userStart,
      finishDate: req.session.userFinish,
    });
    console.log(newUser.time);
    newUser.save();
    res.json(newUser);
  } else {
    res.json("user already exists");
  }
});
