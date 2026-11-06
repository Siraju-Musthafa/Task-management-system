const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createManager,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

// Get all users
router.get("/", protect, authorize("Admin", "Manager"), getAllUsers);

// Get user by ID
router.get("/:id", protect, authorize("Admin", "Manager"), getUserById);

// Create manager
router.post("/manager", protect, authorize("Admin"), createManager);

// Update user role
router.patch("/:id/role", protect, authorize("Admin"), updateUserRole);

// Delete user
router.delete("/:id", protect, authorize("Admin"), deleteUser);

module.exports = router;
