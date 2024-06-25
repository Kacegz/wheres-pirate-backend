const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("welcome");
});

router.get("/characters", (req, res) => {
  res.json("hello");
});

router.post("/user", (req, res) => {
  res.json("hello");
});

module.exports = router;
