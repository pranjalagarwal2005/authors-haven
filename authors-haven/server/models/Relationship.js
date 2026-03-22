const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  projectId: mongoose.Schema.Types.ObjectId,
  from: String,
  to: String,
  relation: String,
});

module.exports = mongoose.model("Relationship", relationshipSchema);
