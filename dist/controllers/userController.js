"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/User");
const { Request, Response, NextFunction } = require("express");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { differenceInMilliseconds } = require("date-fns");
exports.setTimer = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.started) {
        req.session.started = true;
        req.session.userStart = new Date();
        return res.json(true);
    }
    return res.json(req.session.userStart);
}));
exports.stopTimer = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.userFinish = new Date();
    req.session.started = false;
    return res.json({
        time: differenceInMilliseconds(req.session.userFinish, req.session.userStart),
    });
}));
exports.save = [
    body("nickname", "Nickname must not be empty")
        .isLength({ min: 1, max: 50 })
        .escape(),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json({ error: result.array()[0].msg });
        }
        if (req.session.userFinish === null || req.session.userStart === null) {
            return res.json({ error: "Something went wrong" });
        }
        const exists = yield User.findOne({ nickname: req.body.nickname }).exec();
        if (!exists) {
            const newUser = new User({
                nickname: req.body.nickname,
                time: differenceInMilliseconds(req.session.userFinish, req.session.userStart),
            });
            newUser.save();
            return res.json(newUser);
        }
        else {
            return res.json({ error: "User already exists" });
        }
    })),
];
exports.leaderboard = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const top = yield User.find({}).sort({ time: 1 }).limit(10).exec();
    return res.json(top);
}));
