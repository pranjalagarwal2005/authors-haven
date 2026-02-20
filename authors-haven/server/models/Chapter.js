const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);

