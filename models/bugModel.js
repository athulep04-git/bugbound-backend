// import mongoose
const mongoose = require("mongoose");

// Create schema and model
const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  screenshot: {
    type: String,
    default: "",
  },

  priority: {
    type: String,
    required: true,
    default: "Low",
  },

  category: {
    type: String,
    required: true,
    default: "Frontend",
  },

  fixBudget: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Open",
  },

  userMail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("bugs",bugSchema);
