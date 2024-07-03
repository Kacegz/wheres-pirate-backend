const Character = require("../models/Character");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
interface ICoordinatesRequest {
  body: {
    x: number;
    y: number;
    name: string;
  };
}
interface ICharactersRequest {
  body: Array<string>;
}
exports.characters = asyncHandler(async (req: Request, res: any) => {
  const characters = await Character.find({}).exec();
  if (characters.length == 0) {
    return res.json({ error: "No characters found" });
  }
  const names = characters.map((character: any) => character.name);
  return res.json(names);
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
  asyncHandler(async (req: ICoordinatesRequest, res: any) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", message: result.errors[0].msg });
    }
    const character = await Character.findOne({ name: req.body.name }).exec();
    if (character) {
      if (
        character.x + 12 >= req.body.x &&
        req.body.x >= character.x - 12 &&
        character.y + 12 >= req.body.y &&
        req.body.y >= character.y - 12
      ) {
        return res.json({ name: character.name, found: true });
      }
    }
    return res.json({ found: false });
  }),
];
exports.checkWin = asyncHandler(async (req: any, res: any) => {
  if (!(req.body.length == 0)) {
    const characters = await Character.find({}).exec();
    const database = characters.map((character: any) => character.name);
    const request = req.body.map((character: any) => character.name);
    if (database.every((item: any) => request.includes(item))) {
      return res.json(true);
    }
  }
  return res.json(false);
});
