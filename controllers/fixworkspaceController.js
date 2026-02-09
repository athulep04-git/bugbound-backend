const bugs = require("../models/bugModel");
const proposals = require("../models/proposalModel");

exports.getWorkspace = async (req, res) => {
  const { bugId } = req.params;

  try {
    const bug = await bugs.findById(bugId);
    if (!bug) return res.status(404).json("Bug not found");

    const acceptedProposal = await proposals.findOne({
      bugId,
      status: "Accepted",
    });

    if (!acceptedProposal) {
      return res.status(404).json("No accepted proposal found");
    }

    res.status(200).json({
      _id: bug._id,
      title: bug.title,
      category: bug.category,
      fixBudget: bug.fixBudget,
      status: bug.status,
      userMail: bug.userMail,
      assignedTo: acceptedProposal.debuggerMail,
      estimatedTime: acceptedProposal.estimatedTime,
      ratingGiven: bug.ratingGiven,
    });
  } catch (err) {
    res.status(500).json("Server error");
  }
};


exports.markAsFixed = async (req, res) => {
  try {
    const { bugId } = req.params;
    const userMail = req.payload;

    const bug = await bugs.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }

    // Only assigned debugger can mark as fixed
    if (bug.assignedTo !== userMail) {
      return res.status(403).json("Access denied");
    }

    if (bug.status !== "In Progress") {
      return res.status(400).json("Bug not in progress");
    }

    bug.status = "Fixed";
    await bug.save();

    res.status(200).json({ message: "Bug marked as fixed", bug });
  } catch (err) {
    res.status(500).json("Failed to mark bug as fixed");
  }
};

exports.approveBug = async (req, res) => {
  try {
    const { bugId } = req.params;
    const userMail = req.payload;

    const bug = await bugs.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }
    if (bug.userMail !== userMail) {
      return res.status(403).json("Access denied");
    }
    if (bug.status !== "Fixed") {
      return res.status(400).json("Bug is not ready for approval");
    }
    bug.status = "Completed";
    await bug.save();
    res.status(200).json({
      message: "Bug completed successfully",
      bug,
    });
  } catch (err) {
    console.error("Approve bug error:", err);
    res.status(500).json("Failed to approve bug");
  }
};

