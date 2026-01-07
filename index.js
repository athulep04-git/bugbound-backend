require("dotenv").config();

const express = require("express");

const cors = require("cors");
require("./config/db");
const route = require("./router/routes");

const server = express();

server.use(cors());
server.use(express.json());
server.use(route);

const PORT = 3000 || process.env.PORT  ;

server.get('/', (req, res) => {
  res.send("BugBound Hub Backend Running");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
