const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    UploadedImages: {
      type: Array,
      required: true,
    },

    category: {
      type: String,
      required: true,
      default: "Web App",
    },

    reward: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      default: "Easy",
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
