const Character = require("../models/Character");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.characters = asyncHandler(async (req, res) => {
  const characters = await Character.find({}).exec();
  if (characters.length == 0) {
    return res.json({ errror: "No characters found" });
  }
  return res.json(characters);
});
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
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", message: result.errors[0].msg });
    }
    const character = await Character.findOne({ name: req.body.name }).exec();
    if (character) {
      if (
        character.x + 10 >= req.body.x &&
        req.body.x >= character.x - 10 &&
        character.y + 10 >= req.body.y &&
        req.body.y >= character.y - 10
      ) {
        return res.json({ found: true });
      }
    }
    return res.json({ found: false });
  }),
];
