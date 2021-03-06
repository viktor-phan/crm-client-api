const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    require: true,
  },
  company: {
    type: String,
    maxlength: 50,
    require: true,
  },
  address: {
    type: String,
    maxlength: 50,
  },
  phone: {
    type: Number,
    maxlength: 50,
    require: true,
  },
  email: {
    type: String,
    maxlength: 50,
    require: true,
    unique: true
  },
  password: {
    type: String,
    minlegth: 8,
    maxlength: 100,
    require: true,
  },
});
    
module.exports ={UserSchema: mongoose.model("user", UserSchema)} 