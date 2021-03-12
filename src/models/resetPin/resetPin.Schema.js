const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
  email: {
    type: String,
    maxlength: 50,
    require: true,
  },
  pin: {
    type: String,
    maxlength: 6,
    minlength: 6,
  },
  addedAt: {
    type: Date,
    require: true,
    default: Date.now(),
  },
});

module.exports = { ResetPinSchema: mongoose.model("ResetPin", ResetPinSchema) };
