const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    bugId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bugs",
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
