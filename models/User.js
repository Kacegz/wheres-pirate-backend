const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { differenceInMilliseconds } = require("date-fns");
const userSchema = new Schema({
  nickname: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
});
userSchema.virtual("time").get(function () {
  return differenceInMilliseconds(this.finishDate, this.startDate);
});
module.exports = mongoose.model("User", userSchema);
