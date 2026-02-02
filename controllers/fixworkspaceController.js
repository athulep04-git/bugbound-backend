const bugs = require("../models/bugModel");
const proposals = require("../models/proposalModel");

exports.getWorkspace = async (req, res) => {
  const { bugId } = req.params;

  try {
    const bug = await bugs.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }

    const acceptedProposal = await proposals.findOne({
      bugId,
      status: "Accepted",
    });

    if (!acceptedProposal) {
      return res.status(404).json("No accepted proposal found");
    }

    res.status(200).json({
      title: bug.title,
      category: bug.category,
      fixBudget: bug.fixBudget,
      status: bug.status,
      userMail: bug.userMail,
      assignedTo: acceptedProposal.debuggerMail,
      estimatedTime: acceptedProposal.estimatedTime,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
};
