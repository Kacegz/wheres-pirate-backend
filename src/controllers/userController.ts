const User = require("../models/User");
const { Request, Response, NextFunction } = require("express");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { differenceInMilliseconds } = require("date-fns");
interface ISessionRequest extends Request {
  session: {
    started?: boolean;
    userStart?: Date;
    userFinish?: Date;
  };
  body: any;
}

exports.setTimer = asyncHandler(async (req: any, res: any) => {
  if (!req.session.started) {
    req.session.started = true;
    req.session.userStart = new Date();
    await req.session.save();
    console.log(req.session);
    return res.json(true);
  }
  return res.json(req.session.userStart);
});
exports.stopTimer = asyncHandler(async (req: any, res: any) => {
  req.session.userFinish = new Date();
  req.session.started = false;
  await req.session.save();
  console.log(req.session);
  return res.json({
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
  asyncHandler(async (req: any, res: any) => {
    console.log(req.session);
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
      return res.json(newUser);
    } else {
      return res.json({ error: "User already exists" });
    }
  }),
];
exports.leaderboard = asyncHandler(async (req: any, res: any) => {
  const top = await User.find({}).sort({ time: 1 }).limit(10).exec();
  return res.json(top);
});
