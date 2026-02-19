const express = require("express");
const Chapter = require("../models/Chapter");

const router = express.Router();

/* =========================
   CREATE CHAPTER
========================= */
router.post("/", async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);
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
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
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
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: "Chapter deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
