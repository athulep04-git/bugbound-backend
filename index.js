require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

require("./config/db");

const route = require("./router/route");
const appMiddleware = require("./middleware/appMiddleware");
const socketController = require("./controllers/socketController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(appMiddleware);
app.use(route);
app.use("/uploads", express.static("./uploads"));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socketController(io, socket);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("BugBound Hub Backend Running");
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
