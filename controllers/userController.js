const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { differenceInMilliseconds, format } = require("date-fns");
exports.setTimer = asyncHandler(async (req, res) => {
  req.session.userStart = new Date();
  console.log(req.session);
  return res.json(true);
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
  const exists = await User.findOne({ nickname: req.body.nickname }).exec();
  if (!exists) {
    const newUser = new User({
      nickname: req.body.nickname,
      time: differenceInMilliseconds(
        req.session.userFinish,
        req.session.userStart
      ),
    });
    newUser.save();
    res.json(newUser);
  } else {
    res.json({ error: "user already exists" });
  }
});
exports.leaderboard = asyncHandler(async (req, res) => {
  const top = await User.find({}).sort({ time: 1 }).limit(10).exec();
  res.json(top);
});
