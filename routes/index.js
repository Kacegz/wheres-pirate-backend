const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");

router.get("/characters", characterController.characters);
router.post("/check", characterController.check);
router.post("/checkWin", characterController.checkWin);
router.post("/user", (req, res) => {
  res.json("hello");
});

module.exports = router;
