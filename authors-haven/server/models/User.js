const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Required only if googleId is not present
        required: function () { return !this.googleId; }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null/undefined values
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
