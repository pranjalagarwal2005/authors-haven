const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  from: String,
  to: String,
  relation: String,
});

module.exports = mongoose.model("Relationship", relationshipSchema);
