const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed to String to support Firebase UID
        required: true,
    },
    projectId: { // Optional: A character can belong to a project if specified
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    role: { // e.g., Protagonist, Antagonist, Side Character
        type: String,
        default: "Character",
    },
    age: {
        type: String,
    },
    traits: { // Simple array of strings
        type: [String],
        default: [],
    },
    personality: { // Detailed description
        type: String,
    },
    backstory: {
        type: String,
    },
    goals: {
        type: String,
    },
    conflicts: {
        type: String,
    },
    relationships: [{ // Links to other characters
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Character",
        },
        type: {
            type: String, // e.g., Friend, Enemy, Sibling
        },
        description: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model("Character", CharacterSchema);
