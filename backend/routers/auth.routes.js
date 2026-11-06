const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged-in user
router.get("/me", protect, getMe);

module.exports = router;
