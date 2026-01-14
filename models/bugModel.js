// import mongoose
const mongoose = require("mongoose");


const proposalSchema = new mongoose.Schema(
  {
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
      default: 0,
    },
  },
  { timestamps: true }
);

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
     proposals: {
      type: [proposalSchema],
      default: [],
    },
    
},
{ timestamps: true }
);

module.exports = mongoose.model("bugs",bugSchema);
