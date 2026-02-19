const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed to String to support Firebase UID
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    genre: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Idea", "Drafting", "Editing", "Published"],
        default: "Idea",
    },
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
