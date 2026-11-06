const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

// Create task
router.post("/", protect, authorize("Admin", "Manager"), createTask);

// Get all accessible tasks
router.get("/", protect, getAllTasks);

// Get task by ID
router.get("/:id", protect, getTaskById);

// Update task details
router.put("/:id", protect, authorize("Admin", "Manager"), updateTask);

// Update task status
router.patch("/:id/status", protect, updateTaskStatus);

// Delete task
router.delete("/:id", protect, authorize("Admin", "Manager"), deleteTask);

module.exports = router;
