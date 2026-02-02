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
