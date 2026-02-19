const express = require("express");
const Relationship = require("../models/Relationship");

const router = express.Router();

router.post("/", async (req, res) => {
  const relationship = await Relationship.create(req.body);
  res.json(relationship);
});

router.get("/project/:projectId", async (req, res) => {
  const relationships = await Relationship.find({
    projectId: req.params.projectId,
  });
  res.json(relationships);
});

router.delete("/:id", async (req, res) => {
  await Relationship.findByIdAndDelete(req.params.id);
  res.json({ message: "Relationship deleted" });
});

module.exports = router;

