const express = require("express");
const Relationship = require("../models/Relationship");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/", async (req, res) => {
  try {
    const relationship = await Relationship.create({
      ...req.body,
      userId: req.user._id
    });
    res.json(relationship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/project/:projectId", async (req, res) => {
  try {
    const relationships = await Relationship.find({
      projectId: req.params.projectId,
      userId: req.user._id
    });
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rel = await Relationship.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!rel) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Relationship deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


