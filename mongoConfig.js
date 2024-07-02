const mongoose = require("mongoose");
require("dotenv").config();
const mongodb = process.env.db;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongodb);
}
