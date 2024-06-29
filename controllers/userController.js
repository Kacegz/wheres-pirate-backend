const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { differenceInMilliseconds } = require("date-fns");
exports.setTimer = asyncHandler(async (req, res) => {
  req.session.userStart = new Date();
  console.log(req.session);
  res.json(true);
});
exports.stopTimer = asyncHandler(async (req, res) => {
  req.session.userFinish = new Date();
  console.log(req.session);
  res.json({
    time: differenceInMilliseconds(
      req.session.userFinish,
      req.session.userStart
    ),
  });
});
exports.save = asyncHandler(async (req, res) => {
  console.log(req.session);
  console.log(req.body);
  const exists = await User.findOne({ nickname: req.body.nickname }).exec();
  if (!exists) {
    const newUser = new User({
      nickname: req.body.nickname,
      startDate: req.session.userStart,
      finishDate: req.session.userFinish,
    });
    newUser.save();
    res.json(newUser);
  } else {
    res.json({ error: "user already exists" });
  }
});
