const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Make Socket.io accessible inside controllers
app.set("io", io);

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Management API is running",
  });
});

// Verify JWT before allowing a Socket.io connection
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.data.userId = user._id.toString();

    next();
  } catch (error) {
    next(new Error("Invalid or expired socket token"));
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  const userId = socket.data.userId;

  // Each user can join only their own room
  socket.join(userId);

  console.log(`User connected: ${userId}`);

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${userId}`, reason);
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
