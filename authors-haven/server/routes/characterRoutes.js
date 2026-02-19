const express = require("express");
const Character = require("../models/Character");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Apply middleware to all routes
router.use(protect);

// Create a new character
router.post("/", async (req, res) => {
  try {
    const character = await Character.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(character);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all characters for the user (optional project filter)
router.get("/", async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.projectId) {
      query.projectId = req.query.projectId;
    }
    const characters = await Character.find(query);
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get characters by Project ID (legacy support but secured)
router.get("/project/:projectId", async (req, res) => {
  try {
    const characters = await Character.find({
      projectId: req.params.projectId,
      userId: req.user._id
    });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a character
router.put("/:id", async (req, res) => {
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a character
router.delete("/:id", async (req, res) => {
  try {
    const character = await Character.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json({ message: "Character deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
