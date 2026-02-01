const Proposal = require("../models/proposalModel");
const Bug = require("../models/bugModel");

//send request
exports.sendProposal = async (req, res) => {
  try {
    const debuggerMail = req.payload;
    const {bugId,message,proposedAmount,estimatedTime
    } = req.body;

    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }

    if (bug.userMail === debuggerMail) {
      return res.status(403).json("You cannot send a proposal to your own bug");
    }
    const existingProposal = await Proposal.findOne({bugId,debuggerMail});

    if (existingProposal) {
      return res.status(400).json("You already sent a proposal for this bug");
    }
    const newProposal = new Proposal({bugId,postedBy: bug.userMail,debuggerMail,message,proposedAmount,estimatedTime,status: "Pending"});
    await newProposal.save();

    res.status(201).json({
      message: "Proposal sent successfully",proposal: newProposal});

  } catch (err) {
    res.status(500).json("Server error");
  }
};

//get all proposals (owner view)
exports.getBugProposals = async (req, res) => {
  try {
    const {bugId}=req.params;
    const userMail=req.payload;
    const bug=await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }
    if (bug.userMail !== userMail) {
      return res.status(403).json("Access denied");
    }
    const proposals=await Proposal.find({bugId}).sort({createdAt:-1});
    res.status(200).json(proposals);

  } catch (err) {
    res.status(500).json("Server error");
  }
};

//proposal accept
exports.acceptProposal = async (req, res) => {
  try {
    const {proposalId} = req.params;
    const userMail= req.payload;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json("Proposal not found");
    }
    const bug = await Bug.findById(proposal.bugId);
    if (!bug) {
      return res.status(404).json("Bug not found");
    }
    if (bug.userMail !== userMail) {
      return res.status(403).json("Unauthorized");
    }
    if (bug.status==="In Progress") {
      return res.status(400).json("Bug already assigned");
    }
    proposal.status = "Accepted";
    await proposal.save();
    await Proposal.updateMany(
      {
        bugId: bug._id,
        _id: {$ne:proposalId},
      },
      { status: "Rejected" }
    );
    bug.assignedTo = proposal.debuggerMail;
    bug.status = "In Progress";
    await bug.save();
    res.status(200).json({
    message: "Proposal accepted successfully",bug,proposal,});
  } catch (err) {
    res.status(500).json("Server error");
  }
};
