"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nickname: { type: String, required: true },
    time: { type: Date, required: true },
});
module.exports = mongoose.model("User", userSchema);
