const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const userController = require("../controllers/userController");

router.get("/characters", characterController.characters);
router.get("/top", userController.leaderboard);
router.post("/check", characterController.check);
router.post("/checkWin", characterController.checkWin);
router.get("/start", userController.setTimer);
router.get("/stop", userController.stopTimer);
router.post("/save", userController.save);

module.exports = router;
