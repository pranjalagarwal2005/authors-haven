const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Apply middleware to all routes
router.use(protect);

// Create a new project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all projects for the logged-in user
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

