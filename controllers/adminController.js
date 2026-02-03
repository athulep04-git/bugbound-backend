const User = require("../models/userModel");
const Bugs = require("../models/bugModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBugs = await Bugs.countDocuments();
    const activeBugs = await Bugs.countDocuments({
      status: { $ne: "Completed" },
    });

    const blockedUsers = await User.countDocuments({
      isBlocked: true,
    });

    res.status(200).json({
      users: totalUsers,
      bugs: totalBugs,
      activeBugs,
      blockedUsers,
    });
  } catch (err) {
    res.status(500).json("Failed to load admin stats");
  }
};


// get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({role:{$ne:'Admin'}})
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json("Failed to load users");
  }
};

// block user
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (user.role === "Admin") {
      return res.status(403).json("Admin cannot be blocked");
    }
    user.isBlocked = true;
    await user.save();
    res.status(200).json("User blocked successfully");
  } catch (err) {
    res.status(500).json("Failed to block user");
  }
};

// unblock user
exports.unblockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    user.isBlocked = false;
    await user.save();
    res.status(200).json("User unblocked successfully");
  } catch (err) {
    res.status(500).json("Failed to unblock user");
  }
};