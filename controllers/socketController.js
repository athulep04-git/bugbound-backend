const Message = require("../models/messageModel");

module.exports = (io, socket) => {
  console.log("Socket controller active for:", socket.id);

  socket.on("joinRoom", ({ bugId }) => {
    socket.join(bugId);
    console.log(`Socket ${socket.id} joined room ${bugId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const savedMsg = await Message.create(data);
      io.to(data.bugId).emit("receiveMessage", savedMsg);
    } catch (err) {
      console.log("Message save failed", err);
    }
  });
};
