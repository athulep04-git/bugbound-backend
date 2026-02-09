
const Message = require("../models/messageModel");

exports.getMessages = async (req, res) => {
  const { bugId } = req.params;

  try {
    const messages = await Message.find({ bugId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json("Failed to load messages");
  }
};
