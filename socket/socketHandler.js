module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ bugId }) => {
      socket.join(bugId);
      console.log(`User joined room: ${bugId}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.bugId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
