const express = require("express");
const Chapter = require("../models/Chapter");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

/* =========================
   CREATE CHAPTER
========================= */
router.post("/", async (req, res) => {
  try {
    const chapter = await Chapter.create({
      ...req.body,
      userId: req.user._id
    });
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* =========================
   GET CHAPTERS BY PROJECT
========================= */
router.get("/project/:projectId", async (req, res) => {
  try {
    const chapters = await Chapter.find({
      projectId: req.params.projectId,
      userId: req.user._id
    });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   UPDATE CHAPTER
========================= */
router.put("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!chapter) return res.status(404).json({ message: "Not found" });
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* =========================
   DELETE CHAPTER
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!chapter) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Chapter deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

