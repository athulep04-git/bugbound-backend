const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Bugs = require("../models/bugModel");

//register
exports.userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exist");
    }
    else{
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(200).json({ message: "Register success", newUser});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//login
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json("User not found");
    }
    if (existingUser.password !== password) {
      return res.status(401).json("Password mismatch");
    }
    if (existingUser.isBlocked) {
      return res.status(403).json("Your account has been blocked by admin");
    }
    const token = jwt.sign(
      {
        userMail: existingUser.email,
        role: existingUser.role,
      },
      process.env.jwtkey,
    );
    res.status(200).json({
      message: "Login success",
      existingUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
};

//google login
exports.googleUserLogin = async (req, res) => {
  const { username, email, password, profile } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isBlocked) {
        return res.status(403).json("Your account has been blocked by admin");
      }
      const token = jwt.sign(
        {
          userMail: existingUser.email,
          role: existingUser.role,
        },
        process.env.jwtkey,
      );
      return res.status(200).json({
        message: "Login success",
        existingUser,
        token,
      });
    }
    const newUser = new User({
      username,
      email,
      password,
      profile,
    });
    await newUser.save();
    const token = jwt.sign(
      {
        userMail: newUser.email,
        role: newUser.role,
      },
      process.env.jwtkey,
    );
    res.status(200).json({
      message: "User added successfully",
      newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Google login error" });
  }
};

// getprofile
exports.getUserProfile = async (req, res) => {
  const userMail = req.payload;

  try {
    const user = await User.findOne({ email: userMail }).select("-password");
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update profile
exports.updateProfile = async (req, res) => {
  const userMail = req.payload;
  const { username, title, bio, github, linkedin, password } = req.body;
  const profile = req.file ? req.file.filename : req.body.profile;
  try {
    const updateData = { username, title, bio, github, linkedin, profile };
    if (password && password.trim() !== "") {
      updateData.password = password;
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: userMail },
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find(
      { role: "BugBound User" },
      {
        username: 1,
        profile: 1,
        points: 1,
        rating: 1,
        totalFixes: 1,
      },
    )
      .sort({ points: -1 })
      .limit(5);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

//rating
exports.rateDebugger = async (req, res) => {
  try {
    const { debuggerMail, rating, bugId } = req.body;
    const userMail = req.payload;

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json("Invalid rating value");
    }

    const bug = await Bugs.findById(bugId);
    if (!bug) return res.status(404).json("Bug not found");

    if (bug.userMail !== userMail) {
      return res.status(403).json("Access denied");
    }

    if (bug.status !== "Completed") {
      return res.status(400).json("Bug not completed yet");
    }

    if (bug.ratingGiven) {
      return res.status(400).json("Rating already submitted");
    }

    const debuggerUser = await User.findOne({ email: debuggerMail });
    if (!debuggerUser) {
      return res.status(404).json("Debugger not found");
    }

    const totalFixes = debuggerUser.totalFixes + 1;
    const newRating =
      (debuggerUser.rating * debuggerUser.totalFixes + numericRating) /
      totalFixes;

    debuggerUser.totalFixes = totalFixes;
    debuggerUser.rating = Number(newRating.toFixed(1));
    debuggerUser.points += numericRating * 10;

    await debuggerUser.save();

    bug.ratingGiven = true;
    await bug.save();

    res.status(200).json("Rating submitted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to submit rating");
  }
};

