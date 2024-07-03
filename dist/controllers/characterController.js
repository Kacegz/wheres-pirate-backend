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
const Character = require("../models/Character");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
exports.characters = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const characters = yield Character.find({}).exec();
    if (characters.length == 0) {
        return res.json({ error: "No characters found" });
    }
    const names = characters.map((character) => character.name);
    return res.json(names);
}));
exports.check = [
    body("name").isLength({ min: 1 }).withMessage("Not a valid name"),
    body("x")
        .isNumeric()
        .withMessage("Not a number")
        .isLength({ min: 1 })
        .withMessage("Not a valid coordinate"),
    body("y")
        .isNumeric()
        .withMessage("Not a number")
        .isLength({ min: 1 })
        .withMessage("Not a valid coordinate"),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res
                .status(400)
                .json({ error: "Validation failed", message: result.errors[0].msg });
        }
        const character = yield Character.findOne({ name: req.body.name }).exec();
        if (character) {
            if (character.x + 12 >= req.body.x &&
                req.body.x >= character.x - 12 &&
                character.y + 12 >= req.body.y &&
                req.body.y >= character.y - 12) {
                return res.json({ name: character.name, found: true });
            }
        }
        return res.json({ found: false });
    })),
];
exports.checkWin = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req.body.length == 0)) {
        const characters = yield Character.find({}).exec();
        const database = characters.map((character) => character.name);
        const request = req.body.map((character) => character.name);
        if (database.every((item) => request.includes(item))) {
            return res.json(true);
        }
    }
    return res.json(false);
}));
