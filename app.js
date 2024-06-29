const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();
const store = new session.MemoryStore();

const mongodb = process.env.db;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongodb);
}
const indexRouter = require("./routes/index");

const app = express();
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    store,
  })
);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
