const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
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
      enum: ["Open", "In Progress", "Fixed", "Completed"],
      default: "Open",
    },

    userMail: {
      type: String,
      required: true,
    },

    assignedTo: {
      type: String,
      default: "",
    },
    ratingGiven: {
      type: Boolean,
      default: false,
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
    paidBy: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
      default: null,
},
  },
  { timestamps: true },
);

module.exports = mongoose.model("bugs", bugSchema);
