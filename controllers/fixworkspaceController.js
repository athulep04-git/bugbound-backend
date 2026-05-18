
const stripe = require('stripe')(process.env.paymentkey);

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
      paymentDone: bug.paymentDone,
      paidBy: bug.paidBy,
      deadline: bug.deadline,
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

exports.makepayment = async (req, res) => {
  console.log("inside payment");

  const { workspaceDetails } = req.body;
  const userMail = req.payload;

  try {
    const bug = await bugs.findById(workspaceDetails._id);

    if (!bug) {
      return res.status(404).json("Bug not found");
    }

    if (bug.userMail !== userMail) {
      return res.status(403).json("Access denied");
    }

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: bug.title,
            description: `Payment for fixing bug by ${bug.assignedTo}`,
            metadata: {
              bugId: bug._id.toString(),
              debuggerMail: bug.assignedTo,
              ownerMail: bug.userMail,
            },
          },
          unit_amount: Math.round(Number(bug.fixBudget) * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:5173/payment-success/${bug._id}`,
      cancel_url: `http://localhost:5173/payment-fail/${bug._id}`,
    });

    res.status(200).json({message:"success",session,
      sessionId: session.id,
      bug
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Payment failed");
  }
};


exports.confirmPayment = async (req,res) => {
  try {
    const { bugId } =req.params;
    const userMail =req.payload;
    const updatedBug =await bugs.findByIdAndUpdate(bugId,
        {
          paymentDone: true,
          paidBy: userMail
        },
        { new: true }
      );
    res.status(200).json(
      updatedBug
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(
      "Payment confirmation failed"
    );
  }
};