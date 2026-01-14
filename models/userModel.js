const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "BugBound User",
  },
  
  profile:{
    type:String,
    required:false
  },
  points: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalFixes: {
    type: Number,
    default: 0,
  },

});

module.exports = mongoose.model("User", userSchema);
