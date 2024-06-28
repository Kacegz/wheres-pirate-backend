const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { differenceInMilliseconds, format } = require("date-fns");
const userSchema = new Schema(
  {
    nickname: { type: String, required: true },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
  },
  {
    toJSON: { virtuals: true },
  }
);
userSchema.virtual("time").get(function () {
  return format(
    differenceInMilliseconds(this.finishDate, this.startDate),
    "m ss SS"
  );
});
module.exports = mongoose.model("User", userSchema);
