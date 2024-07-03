"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
require("./mongoConfig");
const MongoStore = require("connect-mongo");
const indexRouter = require("./routes/index");
const app = express();
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 30 * 60 * 1000, //30 minutes
    },
    store: MongoStore.create({ mongoUrl: process.env.db }),
}));
app.use(cors({ origin: process.env.cors, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
module.exports = app;
