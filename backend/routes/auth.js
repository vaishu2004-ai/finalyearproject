const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      username: username || email.split("@")[0],
      email:    email.toLowerCase(),
      password: hashed,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ error: "No account found with this email. Please register first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;