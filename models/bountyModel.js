const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      default: "Frontend",
    },

    description: {
      type: String,
      required: true,
    },

    projectUrl: {
      type: String,
      required: true,
    },

    reward: {
      type: Number,
      required: true,
    },

    rules: {
      type: String,
      default: "",
    },

    UploadedImages: {
      type: Array,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("bounties", bountySchema);
