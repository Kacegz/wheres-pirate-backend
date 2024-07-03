"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const characterSchema = new Schema({
    name: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    found: { type: Boolean, required: true, default: false },
});
module.exports = mongoose.model("Characters", characterSchema);
