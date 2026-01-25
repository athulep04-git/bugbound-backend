const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    bugId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bugs",
      required: true,
    },

    postedBy: {
      type: String,
      required: true,
    },

    debuggerMail: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    proposedAmount: {
      type: Number,
      required: true,
    },

    estimatedTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposals", proposalSchema);
