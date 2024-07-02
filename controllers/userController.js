const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { differenceInMilliseconds } = require("date-fns");
exports.setTimer = asyncHandler(async (req, res) => {
  if (!req.session.started) {
    req.session.started = true;
    req.session.userStart = new Date();
    return res.json(true);
  }
  return res.json(req.session.userStart);
});
exports.stopTimer = asyncHandler(async (req, res) => {
  req.session.userFinish = new Date();
  req.session.started = false;
  res.json({
    time: differenceInMilliseconds(
      req.session.userFinish,
      req.session.userStart
    ),
  });
});
exports.save = [
  body("nickname", "Nickname must not be empty")
    .isLength({ min: 1, max: 50 })
    .escape(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ error: result.array()[0].msg });
    }
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
      res.json({ error: "User already exists" });
    }
  }),
];
exports.leaderboard = asyncHandler(async (req, res) => {
  const top = await User.find({}).sort({ time: 1 }).limit(10).exec();
  res.json(top);
});
