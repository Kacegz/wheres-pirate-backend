"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nickname: { type: String },
    time: { type: Date },
});
module.exports = mongoose.model("User", userSchema);
