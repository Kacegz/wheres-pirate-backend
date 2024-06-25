const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const characterSchema = new Schema({
  name: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});
module.exports = mongoose.model("Characters", characterSchema);
