const Proposal = require("../models/proposalModel");
const Bug = require("../models/bugModel");

//send request
exports.sendProposal = async (req, res) => {
  try {
    const debuggerMail = req.payload;
    const { bugId, message, proposedAmount, estimatedTime } = req.body;

    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }

    if (bug.userMail === debuggerMail) {
      return res.status(403).json("You cannot send a proposal to your own bug");
    }
    const existingProposal = await Proposal.findOne({ bugId, debuggerMail });

    if (existingProposal) {
      return res.status(400).json("You already sent a proposal for this bug");
    }
    const newProposal = new Proposal({
      bugId,
      postedBy: bug.userMail,
      debuggerMail,
      message,
      proposedAmount,
      estimatedTime,
      status: "Pending",
    });
    await newProposal.save();

    res.status(201).json({
      message: "Proposal sent successfully",
      proposal: newProposal,
    });
  } catch (err) {
    res.status(500).json("Server error");
  }
};

//get all proposals (owner view)
exports.getBugProposals = async (req, res) => {
  try {
    const { bugId } = req.params;
    const userMail = req.payload;
    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }
    if (bug.userMail !== userMail) {
      return res.status(403).json("Access denied");
    }
    const proposals = await Proposal.find({ bugId }).sort({ createdAt: -1 });
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json("Server error");
  }
};

//proposal accept
exports.acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const userMail = req.payload;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json("Proposal not found");
    }

    if (proposal.status !== "Pending") {
      return res.status(400).json("Proposal already processed");
    }
    const updatedBug = await Bug.findOneAndUpdate(
      { _id: proposal.bugId, userMail, status: "Open" },
      {
  status: "In Progress",
  assignedTo: proposal.debuggerMail,
  deadline: new Date(Date.now() +parseInt(proposal.estimatedTime) *60 *60 *1000)
},
      { new: true },
    );

    if (!updatedBug) {
      return res.status(400).json("Bug already assigned or unauthorized");
    }
    proposal.status = "Accepted";
    await proposal.save();
    await Proposal.updateMany(
      { bugId: proposal.bugId, _id: { $ne: proposalId } },
      { status: "Rejected" },
    );
    res.status(200).json({
      message: "Proposal accepted successfully",
      bug: updatedBug,
      proposal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

//get tasks
exports.getMyTasks = async (req, res) => {
  const debuggerMail = req.payload;
  try {
    const bugsList = await Bug.find({
      assignedTo: debuggerMail,
      status: "In Progress",
    }).sort({ updatedAt: -1 });
    res.status(200).json(bugsList);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load tasks");
  }
};
