const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http");
const {Server} = require("socket.io");
const sockethandeler = require("./socket/socket");


dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/liveclasses",require("./routes/liveClassroutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
  },
});
sockethandeler(io);

app.get("/", (req, res) => {
  res.send("API running...");
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});