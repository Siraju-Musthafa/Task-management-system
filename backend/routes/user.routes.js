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

router.get("/", protect, authorize("Admin", "Manager"), getAllUsers);
router.get("/:id", protect, authorize("Admin", "Manager"), getUserById);
router.post("/manager", protect, authorize("Admin"), createManager);
router.patch("/:id/role", protect, authorize("Admin"), updateUserRole);
router.delete("/:id", protect, authorize("Admin"), deleteUser);

module.exports = router;
